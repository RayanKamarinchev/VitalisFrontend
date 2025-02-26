import React, {useEffect, useState} from 'react';
import {Link, useSearchParams} from "react-router-dom";
import TestList from "./TestList";
import {authGet, urlBuilder} from "../util/utils";
import '../css/testsHome.css'
import {useAuth} from "../user/AuthProvider";
import Filters from "./Filters";

function TestHomePage() {
  const auth = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [model, setModel] = useState(null)
  
  let paginationStart = 0;
  let maxPage = 0;
  let pages = [];
  
  useEffect(() => {
    async function loadData(){
      let res;
      try {
        const allParams = Object.fromEntries(searchParams.entries());
        res = await authGet(urlBuilder(process.env.REACT_APP_API_BASE_URL + 'tests', allParams), auth.token)
      }catch (e){
        try {
          res = await authGet(urlBuilder(process.env.REACT_APP_API_BASE_URL + 'tests'), auth.token)
        }catch (e) {
          console.log(e)
          return;
        }
      }
      setModel(res.data)
      paginationStart = Math.max(1, res.data.currentPage - 3);
      maxPage = Math.min(res.data.totalPages, res.data.currentPage + 3);
      pages = [];
      for (let i = paginationStart; i <= maxPage && i - paginationStart <= 3; i++) {
        pages.push(i);
      }
    }
    
    loadData();
  }, []);
  
  return (
      <div>
        <main className="cd-main-content">
          <div className="floating-container">
            <Link className="floating-button text-decoration-none" to="create">+</Link>
          </div>
          <section className="cd-gallery">
            <ul style={{width: "100%"}}>
              {model &&
                  <TestList tests={model.items}/>
              }
            </ul>
          </section>
          {model &&
          <nav style={{position: "absolute", bottom: "20px", width: "100%"}}>
            <ul className="pagination justify-content-center"
                style={{fontSize: "1.5rem", position: "relative", zIndex: "-1"}}>
              <li className="page-item disabled">
                <Link className={`page-link ${model.currentPage === 1 ? "disabled" : ""})`} to={urlBuilder("/tests", {
                    currentPage: model.currentPage - 1,
                    groups: model.filters.groups,
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
                          groups: model.filters.groups,
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
                        groups: model.filters.groups,
                        grade: model.filters.grade,
                        searchTerm: model.filters.searchTerm,
                        sorting: model.filters.sorting
                    })}>Next</Link>
                </li>
            </ul>
          </nav>
          }
          <Filters setModel={setModel}/>
        </main>
      </div>
  );
}

export default TestHomePage;