"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";
import { BiSend } from "react-icons/bi";
import { useWebSocket } from "@/src/hooks/useWebSocket";

interface SendCryptoModalProps {
    walletAddress?: string;
    close: () => void;
    id?: string;
}

export default function SendCryptoModal({ walletAddress, close, id }: SendCryptoModalProps) {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { handleSendCrypto } = useWebSocket();

    const [amount, setAmount] = useState("");
    const [recipient, setRecipient] = useState("");
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (sending) return;

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
            recipientPubKey = new PublicKey(walletAddress || recipient.trim());
        } catch {
            toast.error("Invalid recipient address.");
            return;
        }

        let toastId: string | number | undefined;

        try {
            setSending(true);

            const lamports = Math.round(sol * 1e9);
            const tx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPubKey,
                    lamports,
                })
            );

            const latest = await connection.getLatestBlockhash();
            tx.feePayer = publicKey;
            tx.recentBlockhash = latest.blockhash;

            toastId = toast.loading("Sending SOL...");

            const signature = await sendTransaction(tx, connection);
            await connection.confirmTransaction(
                {
                    signature,
                    blockhash: latest.blockhash,
                    lastValidBlockHeight: latest.lastValidBlockHeight,
                },
                "confirmed"
            );

            toast.success(`Transaction confirmed: ${signature.slice(0, 8)}…`, { id: toastId });
            handleSendCrypto({
                id: id!,
                amount: sol,
            });
            close();
        } catch (err: any) {
            if (toastId) toast.dismiss(toastId); // dismiss loader if error occurs
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
        <div className="text-neutral-200 flex flex-col gap-y-5 w-full max-w-md">
            <div className="w-full flex justify-center items-center">
                <div className="text-lg font-light">Send Crypto</div>
            </div>

            <div className="flex flex-col gap-3">
                <input
                    type="number"
                    placeholder="Enter amount (SOL)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={cn(
                        "w-full rounded-md border border-neutral-700 px-3 py-2",
                        "bg-neutral-900 text-white placeholder:text-neutral-500",
                        "focus:outline-none focus:ring-2 focus:ring-purple-600"
                    )}
                />
                <input
                    type="text"
                    placeholder="Recipient wallet address"
                    value={walletAddress || recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className={cn(
                        "w-full rounded-md border border-neutral-700 px-3 py-2",
                        "bg-neutral-900 text-white placeholder:text-neutral-500",
                        "focus:outline-none focus:ring-2 focus:ring-purple-600"
                    )}
                />
            </div>

            <div className="w-full flex justify-center">
                <button
                    onClick={handleSend}
                    disabled={sending}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition text-white disabled:opacity-50"
                >
                    {sending ? "Sending..." : "Send"}
                    <BiSend size={18} />
                </button>
            </div>
        </div>
    );
}
