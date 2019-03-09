// https://www.gatsbyjs.org/docs/source-plugin-tutorial/

const fetch = require('node-fetch');
const queryString = require('query-string');

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }, configOptions) => {
  const { createNode } = actions;

  // Remove Gatsby's configOption, it's not needed for this plugin
  delete configOptions.plugins;
  // Helper function to process the rhyme
  const processRhyme = rhyme => {
    const nodeID = createNodeId(`datamuse-rhyme-${$rhyme.word}`);
    const nodeContent = JSON.stringify(rhyme);
    const nodeData = Object.assign({}, photo, {
      id: nodeID,
      parent: null,
      children: [],
      internal: {
        type: `DatamuseRhyme`,
        content: nodeContent,
        contentDigest: createContentDigest(rhyme),
      },
    });

    return nodeData;
  }

  // Convert options object into a query string
  const apiOptions = queryString.stringify(configOptions);

  // Join apiOptions with the datamuse api url
  const apiUrl = `https://api.datamuse.com/words?rel_rhy=${apiOptions}`;

  // Gatsby expects sourceNodes to return a PROMISE
  return (
    // Fetch response
    fetch(apiUrl)
      // Parse response as json
      .then(res => res.json())
      // Process the response into a node
      .then(data => {
        // For each query result
        data.hits.forEach(rhyme => {
          // Process the rhyme data to match the structure of a Gatsby node
          const nodeData = processRhyme(rhyme);
          // Gatsby's helper creates a node from the data
          createNode(nodeData);
        })
      })
  )
}