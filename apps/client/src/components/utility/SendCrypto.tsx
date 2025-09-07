"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { toast } from "sonner";

export default function SendSolForm({ close }: { close: () => void }) {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [amount, setAmount] = useState("");
    const [recipient, setRecipient] = useState("");
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (sending) return;

        // Basic validation
        if (!publicKey) {
            toast.error("Connect your wallet first.");
            return;
        }
        const sol = Number(amount);
        if (!Number.isFinite(sol) || sol <= 0) {
            toast.error("Enter a valid SOL amount.");
            return;
        }

        let recipientPubKey: PublicKey;
        try {
            recipientPubKey = new PublicKey(recipient.trim());
        } catch {
            toast.error("Invalid recipient address.");
            return;
        }

        try {
            setSending(true);

            // Prepare transaction
            const lamports = Math.round(sol * 1e9); // SOL → lamports
            const tx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPubKey,
                    lamports,
                })
            );

            // Set fee payer & recent blockhash for reliability with newer web3 versions
            const latest = await connection.getLatestBlockhash();
            tx.feePayer = publicKey;
            tx.recentBlockhash = latest.blockhash;

            // Toast loading
            const toastId = toast.loading("Sending SOL...");

            // Send & confirm
            const signature = await sendTransaction(tx, connection);
            await connection.confirmTransaction(
                { signature, blockhash: latest.blockhash, lastValidBlockHeight: latest.lastValidBlockHeight },
                "confirmed"
            );

            toast.success(`Transaction confirmed: ${signature.slice(0, 8)}…`, { id: toastId });
            close(); // close on success
        } catch (err: any) {
            // Common case: user rejects the transaction
            const msg =
                typeof err?.message === "string"
                    ? err.message
                    : "Transaction failed.";
            toast.error(msg);
            console.error("Transaction failed:", err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="relative flex flex-col gap-4 p-6 rounded-2xl border border-neutral-800 w-full max-w-md bg-neutral-900 shadow-xl">
                {/* Close button */}
                <button
                    onClick={close}
                    className="absolute top-3 right-3 text-neutral-400 hover:text-white text-lg"
                    aria-label="Close"
                    type="button"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold text-white text-center">Send SOL</h2>

                <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Enter amount (SOL)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border border-neutral-700 rounded-lg p-3 w-full bg-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <input
                    type="text"
                    placeholder="Enter recipient wallet address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="border border-neutral-700 rounded-lg p-3 w-full bg-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />

                <button
                    type="button"
                    onClick={handleSend}
                    disabled={sending}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg py-3 font-medium transition-all"
                >
                    {sending ? "Sending..." : "Send SOL"}
                </button>
            </div>
        </div>
    );
}
