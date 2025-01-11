// import React from 'react';
//
// function Create(props) {
//   const handleInput = (e) => {
//     const { name, value } = e.target;
//     setInput((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//
//   return (
//       <div className="row">
//         <div className="col-sm-12 offset-lg-2 col-lg-8 offset-xl-3 col-xl-6">
//           <form method="post">
//             <div className="form-group">
//               <label htmlFor="isPublic">Is Public</label>
//               <input id="isPublic" type="checkbox" name="isPublic" onChange={handleInput}/>
//             </div>
//             <div className="form-group">
//               <label htmlFor="Title"></label>
//               <input id="title" className="form-control" placeholder="Заглавие..."/>
//               <span asp-validation-for="Title" className="small text-danger"></span>
//             </div>
//             <div className="form-group">
//               <label asp-for="Subject"></label>
//               <select asp-for="Subject" className="form-control">
//                 @foreach (var subjectValue in Enum.GetValues(typeof(Subject)))
//                 {
//                   string name = Enum.GetName(typeof(Subject), subjectValue);
//                   <option value="@subjectValue">@name</option>
//                 }
//               </select>
//               <span asp-validation-for="Subject" className="small text-danger"></span>
//             </div>
//             <div className="form-group">
//               <label asp-for="Time"></label>
//               <input asp-for="Time" className="form-control"/>
//               <span asp-validation-for="Time" className="small text-danger"></span>
//             </div>
//             <div className="form-group">
//               <label asp-for="School"></label>
//               <input asp-for="School" className="form-control" placeholder="Училище..."/>
//               <span asp-validation-for="School" className="small text-danger"></span>
//             </div>
//             <div className="form-group">
//               <label asp-for="Description"></label>
//               <textarea style="margin-left: 0" asp-for="Description" rows="4" className="form-control"
//                         placeholder="Описание..."></textarea>
//               <span asp-validation-for="Description" className="small text-danger"></span>
//             </div>
//             <div className="form-group">
//               <label asp-for="Grade"></label>
//               <select asp-for="Grade" className="form-control">
//                 @for (int i = 1; i <= 12; i++)
//                 {
//                   <option value="@i">@i</option>
//                 }
//               </select>
//               <span asp-validation-for="Grade" className="small text-danger"></span>
//             </div>
//             <div className="text-center">
//               <button className="btn btn-primary mt-3" type="submit" value="Save">Продължи</button>
//             </div>
//           </form>
//         </div>
//       </div>
//   );
// }
//
// export default Create;