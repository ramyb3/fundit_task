import React from "react";
import "./App.css";
import { Matches } from "./Matches";
import { createApiClient, Match } from "./api";

const api = createApiClient();

export default function App() {
  const [search, setSearch] = React.useState<string>("");
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [labels, setLabels] = React.useState<string>(""); // part B.3

  // part D
  const [add, setAdd] = React.useState<boolean>(false);
  const [obj, setObj] = React.useState<any>({
    id: "",
    creationTime: 0,
    companyName: "",
    amountReq: 0,
    labels: [],
  });
  const [borrower, setBorrower] = React.useState<any>({
    bankruptcy: "",
    creditScore: 0,
    ssn: 0,
  });
  const [financeData, setFinanceData] = React.useState<any>({
    number: "",
    balance: 0,
    currency: "",
  });
  const [user, setUser] = React.useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    state: "",
    userIp: "",
  });

  React.useEffect(() => {
    async function fetchMatches() {
      setMatches(await api.getMatches());
    }

    fetchMatches();
  }, []);

  // part D
  const addMatch = () => {
    let msg = "";

    if (obj.companyName === "" || obj.amountReq === 0) {
      msg = "You need to fill all form in 1st section!";
    } else if (
      borrower.bankruptcy === "" ||
      borrower.creditScore === 0 ||
      borrower.ssn === 0
    ) {
      msg = "You need to fill all form in 2nd section!";
    } else if (
      financeData.number === "" ||
      financeData.balance === 0 ||
      financeData.currency === ""
    ) {
      msg = "You need to fill all form in 3rd section!";
    } else if (
      user.firstName === "" ||
      user.lastName === "" ||
      user.email === "" ||
      user.phoneNumber === "" ||
      user.state === "" ||
      user.userIp === ""
    ) {
      msg = "You need to fill all form in 4th section!";
    } else if (obj.labels.length === 0) {
      msg = "You need to choose at least 1 label!";
    }

    if (msg !== "") {
      alert(msg);
      return;
    }

    if (obj.amountReq < 1) {
      // amountReq checker
      msg = "You need to fill the amount!";
      document.getElementById("amount")?.focus();
    } else if (borrower.creditScore < 1) {
      // creditScore checker
      msg = "You need to fill the credit score!";
      document.getElementById("credit")?.focus();
    } else if (borrower.ssn < 1) {
      // ssn checker
      msg = "You need to fill the SSN!";
      document.getElementById("ssn")?.focus();
    } else if (financeData.balance < 1) {
      // balance checker
      msg = "You need to fill the balance!";
      document.getElementById("balance")?.focus();
    } else if (!user.email.includes("@")) {
      // email checker
      msg = "You need to enter a valid email!";
      document.getElementById("email")?.focus();
    }

    // bank number checker (length && numbers)
    for (let i = 0; i < 4; i++) {
      if (
        Number.isNaN(parseInt(financeData?.number[i])) ||
        financeData?.number.length < 4
      ) {
        msg = "You need to fill all 4 digits!";
        document.getElementById("bank")?.focus();
        break;
      }
    }

    if (msg !== "") {
      alert(msg);
      return;
    }

    const allData = {
      id: `${user.lastName}${borrower.creditScore}${user.state}${financeData.number}`,
      creationTime: Date.now(),
      companyName: obj.companyName,
      amountReq: parseInt(obj.amountReq),
      borrower: {
        bankruptcy: borrower.bankruptcy === "0" ? false : true,
        creditScore: parseInt(borrower.creditScore),
        ssn: parseInt(borrower.ssn),
        financeData: {
          number: `XXXXXX${financeData.number}`,
          balance: parseInt(financeData.balance),
          currency: financeData.currency,
        },
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          state: user.state,
          userIp: user.userIp,
        },
      },
      labels: obj.labels,
    };

    setMatches([...matches, allData]);
    setAdd(false);
  };

  // part D - multiple select
  const checkLabels = (e: any) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option: any) => option.value
    );

    setObj({ ...obj, labels: value });
  };

  return (
    <main>
      {!add ? (
        <>
          <h1>Matches List</h1>
          <header>
            <input
              type="search"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </header>

          {/* part B.3 */}
          <div
            className="results"
            style={{ fontSize: "14px", display: "flex", gap: "8px" }}
          >
            Filter by labels:
            <select
              style={{ textAlign: "center" }}
              onChange={(e) => setLabels(e.target.value)}
            >
              <option value="">------</option>
              <option value="Close">Close</option>
              <option value="Possible">Possible</option>
              <option value="Open">Open</option>
              <option value="Decline">Decline</option>
            </select>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginRight: "-40px",
            }}
          >
            <button onClick={() => setAdd(true)}>Add</button>
          </div>

          {matches ? (
            <div className="results">Showing {matches.length} results</div>
          ) : null}

          {matches ? (
            <Matches
              matches={matches}
              search={search}
              labels={labels} /* part B.3 */
            />
          ) : (
            <h2>Loading...</h2>
          )}
        </>
      ) : (
        // part D
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <h1>Adding Match Page</h1>
          <div className="box">
            <h3>Section 1</h3>
            <Input
              placeholder="Company Name"
              onChange={(e: any) =>
                setObj({ ...obj, companyName: e.target.value })
              }
            />
            <Input
              placeholder="Amount Requested"
              id="amount"
              type="number"
              min={1}
              onChange={(e: any) =>
                setObj({ ...obj, amountReq: e.target.value })
              }
            />
          </div>
          <div className="box">
            <h3>Section 2</h3>
            Bankruptcy:
            <input
              type="radio"
              name="a"
              value="0"
              id="no"
              onChange={(e) =>
                setBorrower({ ...borrower, bankruptcy: e.target.value })
              }
            />
            <label htmlFor="no">No</label>
            <input
              type="radio"
              name="a"
              value="1"
              id="yes"
              onChange={(e) =>
                setBorrower({ ...borrower, bankruptcy: e.target.value })
              }
            />
            <label htmlFor="yes">Yes</label>
            <Input
              placeholder="Credit Score"
              id="credit"
              type="number"
              min={1}
              onChange={(e: any) =>
                setBorrower({ ...borrower, creditScore: e.target.value })
              }
            />
            <Input
              placeholder="SSN"
              id="ssn"
              type="number"
              min={1}
              onChange={(e: any) =>
                setBorrower({ ...borrower, ssn: e.target.value })
              }
            />
          </div>
          <div className="box">
            <h3>Section 3</h3>
            <Input
              placeholder="Last 4 Digits Of Bank Number"
              id="bank"
              maxLength={4}
              onChange={(e: any) =>
                setFinanceData({ ...financeData, number: e.target.value })
              }
            />
            <Input
              placeholder="Balance"
              id="balance"
              type="number"
              min={1}
              onChange={(e: any) =>
                setFinanceData({ ...financeData, balance: e.target.value })
              }
            />
            <Input
              placeholder="Currency"
              onChange={(e: any) =>
                setFinanceData({ ...financeData, currency: e.target.value })
              }
            />
          </div>
          <div className="box">
            <h3>Section 4</h3>
            <Input
              placeholder="First Name"
              onChange={(e: any) =>
                setUser({ ...user, firstName: e.target.value })
              }
            />
            <Input
              placeholder="Last Name"
              onChange={(e: any) =>
                setUser({ ...user, lastName: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              type="email"
              id="email"
              onChange={(e: any) => setUser({ ...user, email: e.target.value })}
            />
            <Input
              placeholder="Phone Number"
              onChange={(e: any) =>
                setUser({ ...user, phoneNumber: e.target.value })
              }
            />
            <Input
              placeholder="State"
              onChange={(e: any) => setUser({ ...user, state: e.target.value })}
            />
            <Input
              placeholder="User IP"
              onChange={(e: any) =>
                setUser({ ...user, userIp: e.target.value })
              }
            />
          </div>
          <h3>Labels:</h3>
          <select
            style={{
              textAlign: "center",
              margin: "auto",
              width: "max-content",
              fontSize: "16px",
              marginBottom: "10px",
            }}
            multiple
            onChange={(e) => checkLabels(e)}
          >
            <option value="Close">Close</option>
            <option value="Possible">Possible</option>
            <option value="Open">Open</option>
            <option value="Decline">Decline</option>
          </select>

          <div
            style={{ display: "flex", gap: "5px", justifyContent: "center" }}
          >
            <button onClick={addMatch}>Add Match</button>
            <button onClick={() => setAdd(false)}>Return To Matches</button>
          </div>
        </div>
      )}
    </main>
  );
}

function Input(props: any) {
  return (
    <input
      className="inputs"
      min={props?.min}
      maxLength={props?.maxLength}
      id={props?.id}
      placeholder={props?.placeholder}
      type={props?.type || "text"}
      onChange={props.onChange}
    />
  );
}
