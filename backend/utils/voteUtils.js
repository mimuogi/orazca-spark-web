function updateVoteCounts(post) {
    post.likes = post.votes.filter(v => v.value === 'like').length;
    post.dislikes = post.votes.filter(v => v.value === 'dislike').length;
  }
  
  module.exports = {
    updateVoteCounts
  };
  