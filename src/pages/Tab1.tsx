import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonLabel,
  IonItem,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
} from "@ionic/react";

const BillCutCalculator: React.FC = () => {
  const [bill, setBill] = useState(""); // EMPTY INITIALLY
  const [freight, setFreight] = useState(""); // DEFAULT TO 0
  const [received, setReceived] = useState(""); // EMPTY INITIALLY
  const [billDate, setBillDate] = useState("");
  const [result, setResult] = useState("");
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = () => {
    const billNum = parseFloat(bill || "0");
    const freightNum = parseFloat(freight || "0");
    const receivedNum = parseFloat(received || "0");

    if (!bill || !received || isNaN(billNum) || isNaN(receivedNum)) {
      setResult("❗ Please enter valid Bill and Received amounts.");
      return;
    }

    if (billNum < 0 || freightNum < 0 || receivedNum < 0) {
      setResult("❗ Values cannot be negative.");
      return;
    }

    const total = billNum + freightNum;

    if (total === 0) {
      setResult("❗ Total (Bill + Freight) cannot be zero.");
      return;
    }

    const cutAmount = billNum - receivedNum;
    const percentCut = (cutAmount / total) * 100;

    let daysDiff = "";
    if (billDate) {
      const billDateObj = new Date(billDate);
      const today = new Date();
      const timeDiff = today.getTime() - billDateObj.getTime();
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      daysDiff = `📅 Days since bill: ${days} day${days !== 1 ? "s" : ""}\n`;
    }

    const cutDisplay =
      cutAmount > 0
        ? `🔻 Amount Cut: ₹${cutAmount.toFixed(2)}\n📉 Cut Percentage: ${percentCut.toFixed(2)}%`
        : `✅ No cut, over-received by ₹${Math.abs(cutAmount).toFixed(2)}`;

    const resultText = `
🧾 Total (Bill + Freight): ₹${total.toFixed(2)}
💸 Received: ₹${receivedNum.toFixed(2)}
${freightNum > 0 ? `🚚 Freight Included: ₹${freightNum.toFixed(2)}` : `⚠️ No Freight Included`}
${daysDiff}${cutDisplay}
    `;

    setResult(resultText);
    setCalculated(true);
  };

  const handleRefresh = () => {
    setBill("");
    setFreight("0");
    setReceived("");
    setBillDate("");
    setResult("");
    setCalculated(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="ion-text-center">💰 Bill Cut % Calculator</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ background: "#f0f6ff", color: "#000" }}>
        <div
          style={{
            maxWidth: "420px",
            margin: "auto",
            background: "white",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <IonLabel style={{ fontWeight: "600", color: "#003366" }}>Bill Amount</IonLabel>
          <IonInput
            type="number"
            value={bill}
            placeholder="Enter bill amount"
            onIonInput={(e) => setBill((e.target as HTMLInputElement).value)}
            style={inputStyle}
          />

          <IonLabel style={{ fontWeight: "600", marginTop: "1rem", color: "#003366" }}>Freight Amount</IonLabel>
          <IonInput
            type="number"
            value={freight}
            placeholder="Enter freight (optional)"
            onIonInput={(e) => setFreight((e.target as HTMLInputElement).value)}
            style={inputStyle}
          />

          <IonLabel style={{ fontWeight: "600", marginTop: "1rem", color: "#003366" }}>Received Amount</IonLabel>
          <IonInput
            type="number"
            value={received}
            placeholder="Enter amount received"
            onIonInput={(e) => setReceived((e.target as HTMLInputElement).value)}
            style={inputStyle}
          />

          <IonLabel style={{ fontWeight: "600", marginTop: "1rem", color: "#003366" }}>Bill Date</IonLabel>

          <IonItem lines="none" style={{ "--background": "white", "--color": "#000" }}>
            <IonDatetimeButton datetime="bill-date" style={{ width: "100%" }} />
          </IonItem>

          <IonModal keepContentsMounted={true}>
            <IonDatetime
              id="bill-date"
              presentation="date"
              preferWheel={true}
              onIonChange={(e) => setBillDate(e.detail.value!)}
              style={{
                "--background": "#f5ebf7",
                "--wheel-highlight-background": "#dad8ff",
                "--wheel-highlight-border-radius": "48px",
                "--wheel-fade-background-rgb": "245, 235, 247",
              }}
            ></IonDatetime>
          </IonModal>

          <IonButton
            expand="block"
            onClick={handleCalculate}
            disabled={calculated}
            style={{
              marginTop: "1.5rem",
              fontWeight: "600",
              fontSize: "1rem",
              backgroundColor: "#448aff",
              borderRadius: "12px",
            }}
          >
            Calculate
          </IonButton>

          <IonButton
            expand="block"
            onClick={handleRefresh}
            disabled={!calculated}
            color="medium"
            style={{
              marginTop: "0.75rem",
              fontWeight: "600",
              fontSize: "1rem",
              borderRadius: "12px",
            }}
          >
            Refresh
          </IonButton>

          {result && (
            <div
              style={{
                marginTop: "2rem",
                background: "#e6f7ff",
                color: "#003366",
                padding: "1rem",
                borderRadius: "12px",
                whiteSpace: "pre-line",
                borderLeft: "5px solid #007acc",
              }}
            >
              {result}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

const inputStyle = {
  height: "56px",
  borderRadius: "8px",
  fontSize: "1rem",
  marginTop: "6px",
  border: "1px solid #ccc",
  padding: "12px",
  boxSizing: "border-box" as const,
  background: "#fff",
  color: "#000",
};

export default BillCutCalculator;
