/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination
******************************************/

// Global Variables
const itemsPerPage = 10;
let currentFilteredStudentIndices = [];

// initial calls
appendAdditionalElements();
search();

/**
 * Creates a new element
 * Sets specified attributes
 * Appends created element to a parent node
 * 
 * @param {String} type 
 * @param {Array of Objects (property,value)} attributes 
 * @param {String} parent 
 * @returns element
 */
function createElement(type, attributes, parent){
   const element = document.createElement(type);
   if(attributes && attributes.length != 0){
      for(let i=0; i < attributes.length; i++){
         element[attributes[i].property] = attributes[i].value;
      }
   }
   if(parent){
      parent.appendChild(element);
   }
   return element;
}

/**
 * Dynamically adds the additional elements to the document.
 */
function appendAdditionalElements(){
   const pageDiv = document.querySelector(".page");
   const pageHeaderDiv = document.querySelector(".page-header");
   const studentListUL = document.querySelector(".student-list");

   /**
    * Search bar elements
    * div > input + button
    */
   const studentSearchDivProperties = [{property:"className", value: "student-search"}];
   const studentSearchDiv = createElement("div", studentSearchDivProperties, pageHeaderDiv);

   const studentSearchInputProperties =  [
      {property:"type", value: "text"}, 
      {property:"placeholder", value: "Search for students..."}
   ]
   const studentSearchInput = createElement("input", studentSearchInputProperties, studentSearchDiv);
   studentSearchInput.addEventListener("keyup", search);

   const studentSearchButtonProperties = [{property:"textContent", value: "Search"}];
   const studentSearchButton = createElement("button", studentSearchButtonProperties, studentSearchDiv);
   studentSearchButton.addEventListener("click", search);

   /**
    * No Results Div
    */
   const noResultsDivProperties =  [
      {property:"className", value: "no-results"},
      {property:"textContent", value: "No results"}      
   ];
   const noResultsDiv = createElement("div", noResultsDivProperties);
   pageDiv.insertBefore(noResultsDiv, studentListUL);
   
   /**
    * Paging elements
    * 
    * div > ul
    */
   const paginationDivProperties = [{property:"className", value: "pagination"}];
   const paginationDiv = createElement("div", paginationDivProperties, pageDiv);

   const paginationDivUL = createElement("ul", [], paginationDiv);
   paginationDivUL.addEventListener("click", goToPage);
}

/**
 * Event handler for clicking a page link.
 * 
 * @param {event} event 
 */
function goToPage(event){
   if(event.target.tagName === "A"){
      const pageIndex = parseInt(event.target.textContent) -1;
            
      // Refreshes list to show only items on the clicked page link
      showPage(pageIndex);
   }
}

/**
 * Captures input from search input
 * Filters `currentFilteredStudentIndices` to include only students that match criteria.
 *   - Has input: will check whether input is a substring of student name
 *     (whitespaces will be trimmed, unmatching upper/lower case wouldn't be considered)
 *   - No input: all students are considered a match
 * Recalculates page links  
 * Then, shows page 0.
 */
function search(){
   const allStudents = document.querySelector(".student-list").children;
   const studentSearchInputValue = document.querySelector(".student-search>input").value.trim();
   currentFilteredStudentIndices = [];

   for(let i=0; i < allStudents.length; i++){
      const studentName = allStudents[i].querySelector("h3").textContent.trim();
      if( studentSearchInputValue.length == 0 
         || studentName.toUpperCase().includes(studentSearchInputValue.toUpperCase())){
            currentFilteredStudentIndices.push(i);
      }
   }

   recreatePageLinks();
   showPage(0);
}

/**
 * Recreates page links based on the `currentFilteredStudentIndices`
 */
function recreatePageLinks(){   
   let totalStudents = currentFilteredStudentIndices.length;
   let paginationLinks = document.querySelector(".pagination>ul");

   // Remove page links
   paginationLinks.innerHTML = "";
   
   // Recalculate and add page links
   let totalPages = Math.ceil(totalStudents/ itemsPerPage);
   for(let i=0; i<totalPages; i++){
      const pageLinkLI = createElement("li", [], paginationLinks);

      const pageLinkAProperties = [
         {property:"textContent",value: i+1},
         {property:"href",value: "#"}
      ]; 
      createElement("a", pageLinkAProperties, pageLinkLI);
   }
}

/**
 * Shows/hides students based on `currentFilteredStudentIndices` and page number
 * 
 * @param {number} pageIndex
 */
function showPage(pageIndex = 0){
   const allStudents = document.querySelector(".student-list").children;
   const noResultsDiv = document.querySelector(".no-results");
   const studentListUL = document.querySelector(".student-list");
   const paginationUL = document.querySelector(".pagination>ul");
   
   if(currentFilteredStudentIndices.length <= 0 ){
      // If there are no match, display noResultsDiv and hide student list and page links
      noResultsDiv.style.display = "";
      studentListUL.style.display = "none";
      paginationUL.style.display = "none";

   }else{
      // If there are results, hide noResultsDiv and display student list and page links
      noResultsDiv.style.display = "none";
      studentListUL.style.display = "";
      paginationUL.style.display = "";

      // Remove "active" class from previous active link
      const previousActivePageLink = document.querySelector(".pagination").querySelector(".active");
      if(previousActivePageLink){
         previousActivePageLink.classList.remove("active");
      }
      
      // Adds "active" class to clicked link 
      const newActivePageLink = document.querySelector(`.pagination>ul>li:nth-child(${pageIndex+1})>a`);
      newActivePageLink.classList.add("active");

      // show only items on this page
      const startIndex = pageIndex * itemsPerPage;
      const endIndex = startIndex + itemsPerPage - 1;

      // loop through all students
      for(let i=0; i < allStudents.length; i++){
         // filteredIndex: find the index of i in the `currentFilteredStudentIndices`
         const filteredIndex = currentFilteredStudentIndices.indexOf(i);

         // if not in `currentFilteredStudentIndices`, it means that it does not match search criteria
         if(currentFilteredStudentIndices.indexOf(i) == -1){
            allStudents[i].style.display = "none";
         }else{
            // check if position in `currentFilteredStudentIndices` is between the startIndex and endIndex
            if(filteredIndex >= startIndex && filteredIndex <= endIndex){
               allStudents[i].style.display = "";
            }else{
               allStudents[i].style.display = "none";
            }
         }
      }
   }
}