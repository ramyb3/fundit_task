import React from "react";
import { createData, Match } from "./api";
import "./style.css";

export const Matches = ({
  matches,
  search,
  labels, // part B.3
}: {
  matches: Match[];
  search: string;
  labels: string; // part B.3
}) => {
  let filteredMatches = matches.filter((t) =>
    (
      t.borrower.user.firstName.toLowerCase() +
      t.borrower.user.lastName.toLowerCase() +
      t.borrower.user.email.toLowerCase() + // part B.2
      t.companyName.toLowerCase()
    ) // part B.2
      .includes(search.toLowerCase())
  );

  let label = filteredMatches.filter((x) => x.labels?.includes(labels)); // part B.3

  if (label.length != 0)
    // part B.3
    filteredMatches = label; // part B.3

  if (search != "" && labels != "")
    // part B.3
    filteredMatches = label; // part B.3

  const [status, setStatus] = React.useState<String[]>([]); //part C.2
  const [data, setData] = React.useState<String[]>([]); //part C.2

  const api = createData([data, status]); //part C.2

  React.useEffect(() =>
    //part C.2
    {
      async function fetchMatches() {
        await api.getMatches();
      }
      fetchMatches();
    }, [data]);

  return (
    <ul className="matches">
      {filteredMatches.map((match) => (
        <span key={match.id}>
          {!data.includes(match.id) /* part C.2 */ ? (
            <li className="match">
              <h5 className="title">{match.companyName}</h5>
              <div className="matchData">
                {/* part C.1 */}
                <input
                  className="button"
                  type="button"
                  value="Approve"
                  onClick={() => (
                    setStatus([...status, "approve"]),
                    setData([...data, match.id])
                  )}
                />
                <input
                  style={{ right: "80px" }}
                  className="button"
                  type="button"
                  value="Decline"
                  onClick={() => (
                    setStatus([...status, "decline"]),
                    setData([...data, match.id])
                  )}
                />

                {/* part A */}
                {match.borrower.creditScore > 678 ? (
                  <span className="A"></span>
                ) : null}
                {match.borrower.creditScore > 578 &&
                match.borrower.creditScore < 679 ? (
                  <span className="B"></span>
                ) : null}
                {match.borrower.creditScore < 579 ? (
                  <span className="C"></span>
                ) : null}

                <div>
                  <p className="userDate">
                    <b>Full Name:</b> {match.borrower.user.firstName}{" "}
                    {match.borrower.user.lastName}
                  </p>
                  <p className="userDate">
                    <b>Email:</b> {match.borrower.user.email}
                  </p>
                  <p className="userDate">
                    <b>Amount Request: </b> {match.amountReq}
                  </p>
                  <p className="userDate">
                    <b>Balance: </b> {match.borrower.financeData.balance}{" "}
                    {match.borrower.financeData.currency}
                  </p>
                  <p className="userDate">
                    {" "}
                    {/* part A */}
                    <b>Credit Score: </b> {match.borrower.creditScore}
                  </p>
                </div>
              </div>
              <footer>
                <div className="meta-data">
                  Created At {new Date(match.creationTime).toLocaleString()}
                </div>
              </footer>
            </li>
          ) : null}{" "}
        </span>
      ))}
    </ul>
  );
};
