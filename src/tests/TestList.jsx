import React from 'react';
import {useAuth} from "../user/AuthProvider";
import {Link} from "react-router-dom";
import {urlBuilder} from "../util/utils";

function TestList({tests}) {
  console.log(tests[0])
  const auth = useAuth();
  return (
      <>
        {
          tests.map(t => (
              <div className={"card card-margin"}>
                <div className={"card-header no-border"}>
                  <h5 className={"card-title"}>{t.title} - {t.grade} grade</h5>
                </div>
                <div className={"card-body pt-0"}>
                  <div className={"test"}>
                    <div className={"test-up-container"}>
                      <div className={"avgscore-wrapper"}>
                        <span className={"test-avgscore"}>{`${t.averageScore.toFixed(2)}`}</span>
                      </div>
                      <div className={"groups-wrapper"}>
                        <h6 className={"groups"}>Organic groups:<br></br> {t.groups.join(", ")}</h6>
                      </div>
                    </div>
                    <ol className={"test-info-wrapper text-start"}>
                      <li className={"test-info"}>
                        <span>Questions: <strong>{(t.questionsCount)}</strong></span>
                      </li>
                      <li className={"test-info"}>
                        {/*{t.isCreator ? (*/}
                        {/*    <Link className={"text-decoration-underline"}*/}
                        {/*          to={urlBuilder("/examiners", {*/}
                        {/*            testId: t.id*/}
                        {/*          })}>*/}
                        {/*      Examinees: <strong>{t.testTakers}</strong>*/}
                        {/*    </Link>*/}
                        {/*) : (*/}
                        {/*    <p>Examinees: <strong>{t.testTakers}</strong></p>*/}
                        {/*)}*/}
                        <p>Examinees: <strong>{t.testTakers}</strong></p>
                      </li>
                    </ol>
                    <div className={"test-btns d-flex justify-content-start"}>
                      {
                        t.isCreator ?
                            <Link className={"btn btn-sm btn-primary ms-3"}
                                  to={'edit/' + t.id}>Edit</Link>
                            :
                            (
                              t.isTestTaken ? (
                                  <Link className={"btn btn-sm btn-primary me-2"}
                                        to={"review/" + t.id + '/' + auth.user.id}>Result</Link>
                              ) : (
                                  <Link to={'take/' + t.id} className={"btn btn-sm btn-primary"}>Take test</Link>
                              )
                            )
                      }
                      <small className={"test-info ml-auto"}>{t.createdOn}</small>
                    </div>
                  </div>
                </div>
              </div>
          ))
        }
      </>
  );
}

export default TestList;