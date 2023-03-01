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
  const [status, setStatus] = React.useState<String[]>([]); //part C.2
  const [data, setData] = React.useState<String[]>([]); //part C.2
  const api = createData([data, status]); //part C.2

  //part C.2
  React.useEffect(() => {
    async function fetchMatches() {
      await api.getMatches();
    }

    fetchMatches();
  }, [data]);

  let filteredMatches = matches.filter((t) =>
    (
      t.borrower.user.firstName.toLowerCase() +
      t.borrower.user.lastName.toLowerCase() +
      t.borrower.user.email.toLowerCase() + // part B.2
      t.companyName.toLowerCase()
    ) // part B.2
      .includes(search.toLowerCase())
  );

  const label = filteredMatches.filter((x) => x.labels?.includes(labels)); // part B.3

  // part B.3
  if (label.length !== 0) {
    filteredMatches = label;
  }
  if (search !== "" && labels !== "") {
    filteredMatches = label;
  }

  return (
    <ul className="matches">
      {filteredMatches.map((match) => (
        <span key={match.id}>
          {!data.includes(match.id) /* part C.2 */ ? (
            <li className="match">
              <h5 className="title">{match.companyName}</h5>
              <div className="matchData">
                {/* part C.1 */}

                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    justifyContent: "end",
                    marginTop: "-20px",
                    paddingBottom: "10px",
                  }}
                >
                  <button
                    onClick={() => {
                      setStatus([...status, "approve"]);
                      setData([...data, match.id]);
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setStatus([...status, "decline"]);
                      setData([...data, match.id]);
                    }}
                  >
                    Decline
                  </button>
                </div>

                {/* part A */}
                {match.borrower.creditScore > 678 ? (
                  <span className="letter A"></span>
                ) : null}
                {match.borrower.creditScore > 578 &&
                match.borrower.creditScore < 679 ? (
                  <span className="letter B"></span>
                ) : null}
                {match.borrower.creditScore < 579 ? (
                  <span className="letter C"></span>
                ) : null}

                <div>
                  <Line
                    text="Full Name"
                    value={`${match.borrower.user.firstName} ${match.borrower.user.lastName}`}
                  />
                  <Line text="Email" value={match.borrower.user.email} />
                  <Line text="Amount Request" value={match.amountReq} />
                  <Line
                    text="Balance"
                    value={`${match.borrower.financeData.balance} ${match.borrower.financeData.currency}`}
                  />
                  <Line //part A
                    text="Credit Score"
                    value={match.borrower.creditScore}
                  />
                </div>
              </div>
              <footer>
                <div className="meta-data">
                  Created At {new Date(match.creationTime).toLocaleString()}
                </div>
              </footer>
            </li>
          ) : null}
        </span>
      ))}
    </ul>
  );
};

function Line(props: any) {
  return (
    <p className="userDate">
      <b>{props.text}: </b>
      {props.value}
    </p>
  );
}
