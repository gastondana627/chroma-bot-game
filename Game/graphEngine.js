// graphEngine.js
// Loads story arcs (JSON) and swaps scenes dynamically

let currentNode = null;
let storyGraph = null;

// Load JSON story arc for a character
async function loadStory(character) {
  try {
    const res = await fetch(`/game/scenes/${character}/${character}.json`);
    storyGraph = await res.json();
    console.log(`Loaded story for: ${character}`, storyGraph);

    // Start at first node (S1)
    goToNode("S1");
  } catch (err) {
    console.error("Error loading story:", err);
  }
}

// Render a scene
function goToNode(nodeId) {
  if (!storyGraph || !storyGraph.nodes[nodeId]) return;

  currentNode = storyGraph.nodes[nodeId];
  console.log("Now at:", nodeId, currentNode);

  // Load scene HTML into iframe or container
  const container = document.getElementById("game-container");
  container.innerHTML = `<iframe src="${currentNode.scene}" class="scene-frame"></iframe>`;
}

// Handle choice clicks from scene
function makeChoice(choiceId) {
  if (!currentNode) return;

  const choice = currentNode.choices?.find(c => c.label === choiceId);
  if (choice) {
    goToNode(choice.next);
  }
}

// Listen for postMessage from iframes
window.addEventListener("message", (event) => {
  if (event.data.choice) {
    makeChoice(event.data.choice);
  }
});

// Export to global scope
window.loadStory = loadStory;
window.makeChoice = makeChoice;