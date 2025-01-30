import React from 'react';
import {useAuth} from "../user/AuthProvider";
import {Link} from "react-router-dom";
import {urlBuilder} from "../util/utils";

function TestList({tests}) {
  const auth = useAuth();
  return (
      <>
        {
          tests.map(t => (
              <div className={"card card-margin"}>
                <div className={"card-header no-border"}>
                  <h5 className={"card-title"}>{t.title} - {t.grade} клас</h5>
                </div>
                <div className={"card-body pt-0"}>
                  <div className={"widget-49"}>
                    <div className={"widget-49-title-wrapper"}>
                      <div className={"widget-49-date-primary"}
                           style={{width: "4rem", height: "4rem"}}>
                        <span className={"widget-49-date-day"}>{`${t.averageScore.toFixed(2)}`}</span>
                      </div>
                      <div className={"widget-49-meeting-info"}>
                        <h6 className={"widget-49-pro-title"}>Органични групи: {t.groups}</h6>
                      </div>
                    </div>
                    <ol className={"widget-49-meeting-points text-start"}>
                      <li className={"widget-49-meeting-item"}>
                        <span>Въпроси: <strong>{(t.questionsCount)}</strong></span>
                      </li>
                      <li className={"widget-49-meeting-item"}>
                        {t.isCreator ? (
                            <Link className={"text-decoration-underline"}
                                  to={urlBuilder("/examiners", {
                                    testId: t.id
                                  })}>
                              Предали: <strong>{t.testTakers}</strong>
                            </Link>
                        ) : (
                            <p>Предали: <strong>{t.testTakers}</strong></p>
                        )}
                      </li>
                    </ol>
                    <div className={"widget-49-meeting-action d-flex justify-content-start"}>
                      {
                        t.isCreator ?
                            <Link className={"btn btn-sm btn-primary ms-3"}
                                  to={'edit/' + t.id}>Edit</Link>
                            :
                            (
                              t.isTestTaken ? (
                                  <Link className={"btn btn-sm btn-primary me-2"}
                                        to={urlBuilder("/review", {
                                          testId: t.id,
                                          userId: auth.user.id
                                        })}>Result</Link>
                              ) : (
                                  <Link to={'take/' + t.id} className={"btn btn-sm btn-primary"}>Take test</Link>
                              )
                            )
                      }
                      <small className={"widget-49-meeting-item ml-auto"}>{t.createdOn}</small>
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