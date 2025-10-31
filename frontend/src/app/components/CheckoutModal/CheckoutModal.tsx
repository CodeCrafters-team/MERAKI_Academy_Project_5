"use client";

import { useState, useEffect, MouseEvent } from "react";
import axios from "axios";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: number | null;
  courseId: number | string;
  apiBase?: string;             
  cPrice: number | null;
  paymentsPrefix?: string;           
};

export default function CheckoutModal({
  open,
  onClose,
  userId,
  courseId,
  apiBase = "https://meraki-academy-project-5-anxw.onrender.com",
  paymentsPrefix = "/payments",
  cPrice
}: Props) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [focused, setFocused] =
    useState<"name" | "number" | "expiry" | "cvc" | undefined>("name");

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) setIsClosing(false);
  }, [open]);

  const headers = {
    Authorization: `Bearer ${typeof window !== "undefined" ? (localStorage.getItem("token") || "") : ""}`,
  };

  const DEMO_CARD_NUMBER = "4242 4242 4242 4242";
  const DEMO_CARD_EXPIRY = "12/34";
  const DEMO_CARD_CVC = "123";

  const formatNumber = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const s = v.replace(/\D/g, "").slice(0, 4);
    if (s.length <= 2) return s;
    return s.slice(0, 2) + "/" + s.slice(2);
  };
  const formatCvc = (v: string) => v.replace(/\D/g, "").slice(0, 4);

  const fmtMoney = (v: number | string | null) => {
    const n = typeof v === "string" ? Number(v) : v;
    if (n == null || Number(n) === 0 || Number.isNaN(n)) return "Free";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(Number(n as number));
  };

  const startClose = () => setIsClosing(true);

  const handleAnimEnd = () => {
    if (isClosing) onClose();
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) startClose();
  };

  const handlePay = () => {
    setError(null);
    setOk(null);

    if (!userId || !courseId) { setError("Missing user or course"); return; }
    if (!cPrice || cPrice <= 0) { setError("Invalid price"); return; }

    setLoading(true);

    axios.post(
      `${apiBase}${paymentsPrefix}/create-payment-intent`,
      {
        amount: Math.round(cPrice * 100),
        currency: "usd",
        demo: true,
        demo_card: {
          number: DEMO_CARD_NUMBER.replace(/\s+/g, ""),
          expiry: DEMO_CARD_EXPIRY,
          cvc: DEMO_CARD_CVC,
        },
      },
      { headers }
    )
    .then((res) => {
      const paymentIntentId = res.data?.paymentIntentId;
      if (!paymentIntentId) throw new Error("No paymentIntentId returned from server");
      return axios.post(
        `${apiBase}${paymentsPrefix}/confirm-enrollment`,
        {
          paymentIntentId,
          user_id: userId,
          course_id: Number(courseId),
          card_last4: (DEMO_CARD_NUMBER.match(/\d{4}$/) || ["0000"])[0],
        },
        { headers }
      );
    })
    .then((res) => {
      if (!res.data?.success) throw new Error("Confirm enrollment failed");
      setOk("Payment successful. Enrollment confirmed");
      startClose();
    })
    .catch((e) => {
      const msg = "Payment error";
      setError(msg);
    })
    .finally(() => {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setLoading(false);
    });
  };

  if (!open) return null;

  const backdropAnim = isClosing ? "animate__animated animate__fadeOut" : "animate__animated animate__fadeIn";
  const modalAnim    = isClosing ? "animate__animated animate__fadeOutUp" : "animate__animated animate__fadeInDown";

  return (
    <div
      onClick={handleBackdropClick}
      onAnimationEnd={handleAnimEnd}
      role="dialog"
      aria-modal="true"
      className={`position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center ${backdropAnim}`}
      style={{ background: "rgba(0,0,0,.45)", zIndex: 1050 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded shadow p-3 ${modalAnim}`}
        style={{ width: 420, maxWidth: "92%" , zIndex: 9999 , marginTop: "4em" }}
      >
        <div className="d-flex align-items-start justify-content-between mb-2">
          <h5 className="mb-0">Checkout</h5>
        </div>

        <div className="mb-3">
          <Cards
            number={number || "•••• •••• •••• ••••"}
            name={name || "YOUR NAME"}
            expiry={expiry || "••/••"}
            cvc={cvc || "•••"}
            focused={focused}
            placeholders={{ name: "YOUR NAME" }}
          />
        </div>

        <div className="mb-2">
          <label className="form-label mb-1">Name on card</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setFocused("name")}
            placeholder="Full name "
          />
        </div>

        <div className="mb-2">
          <label className="form-label mb-1">Card Number </label>
          <input
            className="form-control"
            value={number}
            onChange={(e) => setNumber(formatNumber(e.target.value))}
            onFocus={() => setFocused("number")}
            placeholder="•••• •••• •••• ••••"
            inputMode="numeric"
          />
        </div>

        <div className="mb-2 d-flex gap-2">
          <div className="flex-fill">
            <label className="form-label mb-1">Expiry </label>
            <input
              className="form-control"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              onFocus={() => setFocused("expiry")}
              placeholder="MM/YY"
              inputMode="numeric"
            />
          </div>
          <div className="flex-fill">
            <label className="form-label mb-1">CVC </label>
            <input
              className="form-control"
              value={cvc}
              onChange={(e) => setCvc(formatCvc(e.target.value))}
              onFocus={() => setFocused("cvc")}
              placeholder="CVC"
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="form-text mb-2">
          Note: This is a demo interface. The data sent is for testing purposes only.
        </div>

        {error && <div className="alert alert-danger mt-2">{error}</div>}
        {ok && <div className="alert alert-success mt-2">{ok}</div>}

        <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
          <strong>Total: <span style={{color:"green"}}>{fmtMoney(cPrice)}</span></strong>
          <div className="d-flex gap-2">
            <button className="btn btn-secondary" onClick={startClose} disabled={loading}>
              Cancel
            </button>
            <button
              className="btn btn-primary border-0"
              onClick={handlePay}
              disabled={loading || !cPrice || !userId || !courseId}
            >
              {loading ? "Processing..." : "Pay now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
