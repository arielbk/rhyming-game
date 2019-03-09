/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const axios = require('axios');
const crypto = require('crypto');

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions;

  // fetch data from datamuse api
  const fetchRhymingWord = () => axios.get(`https://api.datamuse.com/words?rel_rhy=forgetful`)
  // await results
  const res = await fetchRhymingWord();
  console.log(res.data);
  // process results and create nodes
  res.data.map((rhyme, i) => {
    const rhymeNode = {
      id: `${i}`,
      parent: `__SOURCE__`,
      internal: {
        type: `Rhyme`,
      },
      children: [],

      // Other fields to query
      word: rhyme.word,
      score: rhyme.score,
      numSyllables: rhyme.numSyllables
    }

    // Content digest for the node (required)
    const contentDigest = crypto
      .createHash(`md5`)
      .update(JSON.stringify(rhymeNode))
      .digest(`hex`);
    // Add content digest to the node
    rhymeNode.internal.contentDigest = contentDigest;

    // Finally, create the node
    createNode(rhymeNode);
  });
}