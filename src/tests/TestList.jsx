import React from 'react';
import {urlBuilder} from "../util/urlBuilder";
import {useAuth} from "../user/AuthProvider";
import {Link} from "react-router-dom";

function TestList({tests}) {
  const auth = useAuth();
  
  return (
      <>
        {
          tests.map(t => (
              //converted to jsx
              <div className={"card mb-3"}>
                <div className={"card-header d-flex align-items-center"}>
                  <h6 className={"mb-0"}>{t.title} - {t.grade} клас</h6>
                </div>
                <div className={"card-body"}>
                  <div className={"d-flex align-items-center mb-3"}>
                    <div
                        className={"bg-primary text-white rounded-circle d-flex flex-column align-items-center justify-content-center p-3"}
                        style={{width: "4rem", height: "4rem"}}>
                      <span className={"fw-bold fs-5"}>{`${t.averageScore.toFixed(2)}`}</span>
                    </div>
                    <div className={"ms-3"}>
                      <h6 className={"mb-0"}>{t.groups}</h6>
                      <small className={"text-muted"}>{t.createdOn}</small>
                    </div>
                  </div>
                  <ul className={"list-unstyled mb-3"}>
                    <li>Въпроси: <strong>{(t.openQuestions.length + t.closedQuestions.length)}</strong>
                    </li>
                    <li>Време: <strong>{t.time} мин</strong></li>
                    <li>
                      {t.isCreator ? (
                          <Link className={"text-decoration-underline text-muted"}
                                to={urlBuilder("/examiners", {
                                  testId: t.Id
                                })}>
                            Предали: <strong>{t.examiners}</strong>
                          </Link>
                      ) : (
                          <p>Предали: <strong>{t.examiners}</strong></p>
                      )}
                    </li>
                  </ul>
                  <div className={"d-flex justify-content-end"}>(
                    t.isTestTaken ? (
                    <>
                      <Link className={"btn btn-sm btn-primary me-2"}
                            to={urlBuilder("/review", {
                              testId: t.Id,
                              userId: auth.user.id
                            })}>Резултати</Link>
                    </>
                    ) : (
                    <a onClick={"warn(t.Id, t.Time, t.Title)"}
                       className={"btn btn-sm btn-secondary"}>Направи</a>
                    )
                    )
                  </div>
                </div>
              </div>
          ))
        }
      </>
  );
}

export default TestList;