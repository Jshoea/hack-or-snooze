"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showFave = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
//handles creating new story
async function submitNewStory (evt) {
  console.debug ("submitNewStory");
  evt.preventDefault();

  //use all the information from form
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username;
  const storyData = {title,url,author,username};
  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  //now reset the form and hide
  $submitForm.slideUp("fast");
  $submitForm.trigger("reset");
}
$submitForm.on("submit", submitNewStory);







//Handles deleting stories
async function deleteStory (evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId)

  await putUserStoriesOnPage();
}
$ownStories.on("click", ".trash-can", deleteStory);
  //on click will delete story




function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");

  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>You have no favorites added</h5>");
    //if there are no entries in the list, we place in no favorites
  } else {
    // loop through all of users favorites and generate HTML for them
    //we'll loop through the currentUser.favorites
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      //how we are going to generate HTML of each story function above- line 22
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}

//now to untoggle the favorite and remove from list
async function toggleStoryFavorite(evt) {

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId)
}