// Click Functions
//====================================
// Function to save articles on home page
$(document).on("click", ".save", saveArticles);






// Function to save a article
function saveArticles() {
    // Grab ID associated with article
   const thisId = $(this).parent().prev().children().attr("data-id");
   const thisTitle = $(this).parent().prev().text();
   const thisSummary = $(this).prev().text();
   const thisLink = $(this).parent().prev().children().children("a").attr("href");
   const thisPic = $(this).parent().prev().children().children().attr("src");
   console.log(thisId);
   // Run a POST request to saved articles route
   $.ajax({
       method: "POST",
       url: "/articles/saved/" + thisId,
       data: {
           title: thisTitle,
           summary: thisSummary,
           link: thisLink,
           pic: thisPic
       }
   })
    .then(function(data) {
        
    });
    
};



