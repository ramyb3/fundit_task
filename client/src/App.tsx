import React, { useState } from "react";
import "./App.css";
import { Matches } from "./Matches";
import { createApiClient, Match } from "./api";

export type AppState = {
  matches?: Match[];
  search: string;
};

const api = createApiClient();

const App = () => {
  const [search, setSearch] = React.useState<string>("");
  const [matches, setMatches] = React.useState<Match[]>([]);

  const [labels, setLabels] = React.useState<string>(""); // part B.3

  // part D
  const [add, setAdd] = useState(false);
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

  const press = () =>
    // part D
    {
      let ok = true; // flag for form
      let message = false; // flag for alerts

      if (obj.companyName == "" || obj.amountReq == 0) {
        alert("You need to fill all form in 1st section!");
        message = true;
        ok = false;
      }

      if (
        (borrower.bankruptcy === "" ||
          borrower.creditScore == 0 ||
          borrower.ssn == 0) &&
        ok == true
      ) {
        alert("You need to fill all form in 2nd section!");
        message = true;
        ok = false;
      }

      if (
        (financeData.number == "" ||
          financeData.balance == 0 ||
          financeData.currency == "") &&
        ok == true
      ) {
        alert("You need to fill all form in 3rd section!");
        message = true;
        ok = false;
      }

      if (
        (user.firstName == "" ||
          user.lastName == "" ||
          user.email == "" ||
          user.phoneNumber == "" ||
          user.state == "" ||
          user.userIp == "") &&
        ok == true
      ) {
        alert("You need to fill all form in 4th section!");
        message = true;
        ok = false;
      }

      if (obj.labels.length == 0 && ok == true) {
        alert("You need to choose at least 1 label!");
        message = true;
        ok = false;
      }

      if (borrower.bankruptcy === "true")
        // change bankruptcy to boolean value
        borrower.bankruptcy = true;

      if (borrower.bankruptcy === "false")
        // change bankruptcy to boolean value
        borrower.bankruptcy = false;

      if (message == false) {
        for (
          var i = 0;
          i < 4;
          i++ // bank number checker (length && numbers)
        ) {
          if (
            Number.isNaN(parseInt(financeData.number[i])) ||
            financeData.number.length < 4
          ) {
            document.getElementById("bank")?.focus();
            ok = false;
            break;
          }
        }
      }

      if (obj.amountReq < 1 && message == false) {
        // amountReq checker
        document.getElementById("amount")?.focus();
        ok = false;
      }

      if (borrower.creditScore < 1 && message == false) {
        // creditScore checker
        document.getElementById("credit")?.focus();
        ok = false;
      }

      if (borrower.ssn < 1 && message == false) {
        // ssn checker
        document.getElementById("ssn")?.focus();
        ok = false;
      }

      if (financeData.balance < 1 && message == false) {
        // balance checker
        document.getElementById("balance")?.focus();
        ok = false;
      }

      if (!user.email.includes("@") && message == false) {
        // email checker
        document.getElementById("email")?.focus();
        ok = false;
      }

      if (ok == true) {
        // form is valid
        let allData = {
          id:
            user.lastName +
            borrower.creditScore +
            user.state +
            financeData.number,
          creationTime: Date.now(),
          companyName: obj.companyName,
          amountReq: parseInt(obj.amountReq),
          borrower: {
            bankruptcy: borrower.bankruptcy,
            creditScore: parseInt(borrower.creditScore),
            ssn: parseInt(borrower.ssn),
            financeData: {
              number: "XXXXXX" + financeData.number,
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

        console.log(allData);

        setAdd(false);
      }
    };

  const check = (
    e: any // part D - multiple select
  ) => {
    let value = Array.from(
      e.target.selectedOptions,
      (option: any) => option.value
    );

    setObj({ ...obj, labels: value });
  };

  React.useEffect(() => {
    async function fetchMatches() {
      setMatches(await api.getMatches());
    }
    fetchMatches();
  }, []);
  let searchDebounce: any;
  const onSearch = (val: string, newPage?: number) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(async () => {
      setSearch(val);
    }, 300);
  };
  return (
    <main>
      {add == false ? (
        <>
          <h1>Matches List</h1>
          <header>
            <input
              type="search"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)}
            />
          </header>

          {/* part B.3 */}
          <div className="results" style={{ fontSize: "14px" }}>
            Filter by labels: &nbsp;&nbsp;
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

          <input
            type="button"
            value="Add"
            className="button"
            style={{ top: "200px", right: "95px" }}
            onClick={() => setAdd(true)}
          />

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
        <div style={{ textAlign: "center" }}>
          <h1>Adding Match Page</h1>
          <div className="box">
            <h3>Section 1</h3>
            <input
              className="inputs"
              placeholder="Company Name"
              type="text"
              onChange={(e) => setObj({ ...obj, companyName: e.target.value })}
            />
            <br />
            <input
              className="inputs"
              placeholder="Amount Requested"
              id="amount"
              type="number"
              min={1}
              onChange={(e) => setObj({ ...obj, amountReq: e.target.value })}
            />
            <br />
            <br />
          </div>
          <br />
          <div className="box">
            <h3>Section 2</h3>
            Bankruptcy:
            <input
              type="radio"
              name="a"
              value="false"
              onChange={(e) =>
                setBorrower({ ...borrower, bankruptcy: e.target.value })
              }
            />
            No &nbsp;&nbsp;
            <input
              type="radio"
              name="a"
              value="true"
              onChange={(e) =>
                setBorrower({ ...borrower, bankruptcy: e.target.value })
              }
            />
            Yes
            <br />
            <input
              className="inputs"
              placeholder="Credit Score"
              id="credit"
              type="number"
              min={1}
              onChange={(e) =>
                setBorrower({ ...borrower, creditScore: e.target.value })
              }
            />
            <br />
            <input
              className="inputs"
              placeholder="SSN"
              id="ssn"
              type="number"
              min={1}
              onChange={(e) =>
                setBorrower({ ...borrower, ssn: e.target.value })
              }
            />
            <br />
            <br />
          </div>
          <br />
          <div className="box">
            <h3>Section 3</h3>
            <input
              className="inputs"
              placeholder="Last 4 Digits Of Bank Number"
              id="bank"
              type="text"
              maxLength={4}
              onChange={(e) =>
                setFinanceData({ ...financeData, number: e.target.value })
              }
            />
            <br />
            <input
              className="inputs"
              placeholder="Balance"
              id="balance"
              type="number"
              min={1}
              onChange={(e) =>
                setFinanceData({ ...financeData, balance: e.target.value })
              }
            />
            <br />
            <input
              className="inputs"
              placeholder="Currency"
              type="text"
              onChange={(e) =>
                setFinanceData({ ...financeData, currency: e.target.value })
              }
            />
            <br />
            <br />
          </div>
          <br />
          <div className="box">
            <h3>Section 4</h3>
            <input
              className="inputs"
              placeholder="First Name"
              type="text"
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            />
            <br />
            <input
              className="inputs"
              placeholder="Last Name"
              type="text"
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />
            <br />
            <input
              className="inputs"
              placeholder="Email"
              id="email"
              type="email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <br />
            <input
              className="inputs"
              placeholder="Phone Number"
              type="text"
              onChange={(e) =>
                setUser({ ...user, phoneNumber: e.target.value })
              }
            />
            <br />
            <input
              className="inputs"
              placeholder="State"
              type="text"
              onChange={(e) => setUser({ ...user, state: e.target.value })}
            />
            <br />
            <input
              className="inputs"
              placeholder="User IP"
              type="text"
              onChange={(e) => setUser({ ...user, userIp: e.target.value })}
            />
            <br />
            <br />
          </div>
          <h3>Labels:</h3>
          <select
            style={{ textAlign: "center", width: "120px", fontSize: "16px" }}
            multiple
            onChange={(e) => check(e)}
          >
            <option value="Close">Close</option>
            <option value="Possible">Possible</option>
            <option value="Open">Open</option>
            <option value="Decline">Decline</option>
          </select>
          <br />
          <br />
          <input
            type="button"
            style={{ cursor: "pointer" }}
            value="Add Match"
            onClick={press}
          />
          &nbsp;&nbsp;
          <input
            type="button"
            style={{ cursor: "pointer" }}
            value="Return To Matches"
            onClick={() => setAdd(false)}
          />
        </div>
      )}
    </main>
  );
};
export default App;
