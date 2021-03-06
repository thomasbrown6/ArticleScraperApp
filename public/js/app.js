// Click Functions
//====================================
// Function to save articles on home page
$(document).on("click", ".save", saveArticles);
$(document).on("click", ".scrape-new", scrapeArticles);
$(document).on("click", ".delete", removeArticles);
$(document).on("click", ".clear", clearArticles);
$(document).on("click", "#saveChanges", postComment); 
$(document).on("click", "#deleteComment", deleteComment); 




// Function to save a article
function saveArticles() {
  const thisId = $(this).parent().prev().children().attr("data-id");
  // Run a POST request to saved articles route
  $.ajax({
    method: "PUT",
    url: `/articles/saved/${thisId}`,
    data: {
      saved: true
    }
  }).then(function(data) {
      console.log("firing the .then");
    window.location.reload();
    alert("Article saved");
  });
};


function scrapeArticles() {
    $.post("/articles").then(function() {
        location.replace('/articles');
    }).catch(function(err) {
        throw err;
    });
    alert("Scraping New Articles...");
}

// Function to remove articles from saved page
function removeArticles() {
  const thisId = $(this).parent().prev().children().attr("data-id");
  console.log(thisId);
  // Run a POST request to saved articles route
  $.ajax({
    method: "PUT",
    url: `/articles/unsave/${thisId}`,
    data: {
      saved: false
    }
  }).then(function(data) {
    window.location.reload();
  });
};

// Function to clear articles from MongoDB and home page
function clearArticles() {
    $.ajax({
        url: "/articles/clear",
        type: "GET",
        success: function(result) {
        }
    }).then(function(data) {
        window.location.reload();
        alert("Clearing Unsaved Articles...");
    });

};


// Function to post comment to article on saved page
function postComment() {
  const bodyInput = $("#commentBody").val().trim();  
  const thisId = $(this).attr("data-id");
  console.log(bodyInput);
  $.ajax({
    method: "POST", 
    url: `/articles/comment/${thisId}`,
    data: {
      comment: bodyInput
    }
  })
    .then(function(data) {

    });
    $("#closeButton").click();
    window.location.reload();
    console.log(bodyInput);

};


function deleteComment() {
  const thisId = $(this).parent().attr("data-id");
  console.log(thisId);
  $.ajax({
    url: `/articles/comment/${thisId}`,
    type: "GET",
    success: function(result) {
        console.log(result);
    }
});  
window.location.reload();
};