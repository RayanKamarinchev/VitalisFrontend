import React from 'react';
import {Link} from "react-router-dom";
import TestList from "./TestList";
import {urlBuilder} from "../util/utils";

function TestHomePage({model}) {
  let paginationStart = Math.max(1, model.currentPage - 3);
  let maxPage = Math.min(model.totalPages, model.currentPage + 3);
  const pages = [];
  for (let i = paginationStart; i <= maxPage && i - paginationStart <= 3; i++) {
    pages.push(i);
  }
  
  return (
      <div>
        <main className="cd-main-content">
          <div className="floating-container">
            <Link className="floating-button" to="/create">+</Link>
          </div>
          <section className="cd-gallery">
            <ul style={{width: "100%"}}>
              <TestList tests={model.items}/>
            </ul>
          </section>
          <nav style={{position: "absolute", bottom: "20px", width: "100%"}}>
            <ul className="pagination justify-content-center"
                style={{fontSize: "1.5rem", position: "relative", zIndex: "-1"}}>
              <li className="page-item disabled">
                <Link className={`page-link ${model.currentPage === 1 ? "disabled" : ""})`} to={urlBuilder("/tests", {
                    currentPage: model.currentPage - 1,
                    subject: model.filters.subject,
                    grade: model.filters.grade,
                    searchTerm: model.filters.searchTerm,
                    sorting: model.filters.sorting
                })}>Previous</Link>
              </li>
              {
                pages.map(page => (
                    <li className={`page-item ${model.currentPage === page ? "active" : ""})`} key={page}>
                      <Link className="page-link" to={urlBuilder("/tests", {
                          currentPage: page,
                          subject: model.filters.subject,
                          grade: model.filters.grade,
                          searchTerm: model.filters.searchTerm,
                          sorting: model.filters.sorting
                      })}>{page}</Link>
                    </li>
                ))
              }
                <li className="page-item disabled">
                    <Link className={`page-link ${model.currentPage === maxPage ? "disabled" : ""})`} to={urlBuilder("/tests", {
                        currentPage: model.currentPage + 1,
                        subject: model.filters.subject,
                        grade: model.filters.grade,
                        searchTerm: model.filters.searchTerm,
                        sorting: model.filters.sorting
                    })}>Next</Link>
                </li>
            </ul>
          </nav>
          <partial model="Model.Filters" name="FilterMenuPartialView"/>
        </main>
      </div>
  );
}

export default TestHomePage;