// graphEngine.js

let currentStory = null;
let currentNode = null;
let audio = null;

// Load character story JSON dynamically
async function loadStory(character) {
  try {
    const res = await fetch(`/game/scenes/${character}/${character}.json`);
    currentStory = await res.json();

    // Apply theme (CSS body class)
    document.body.className = character;

    // Load and play theme music
    if (audio) {
      audio.pause();
      audio = null;
    }
    audio = new Audio(currentStory.theme.music);
    audio.loop = true;
    audio.volume = 0.7;
    audio.play().catch(err => {
      console.warn("⚠️ Autoplay blocked, waiting for user interaction", err);
      document.addEventListener("click", () => audio.play(), { once: true });
    });

    // Start story
    goToNode("S1");
  } catch (err) {
    console.error(`Failed to load story for ${character}:`, err);
  }
}

// Go to a node (scene)
function goToNode(nodeId) {
  currentNode = currentStory.nodes[nodeId];

  if (!currentNode) {
    console.error("Invalid node:", nodeId);
    return;
  }

  // Load scene HTML into iframe or container
  const sceneFrame = document.getElementById("sceneFrame");
  sceneFrame.src = currentNode.scene;

  // Render choices
  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  if (currentNode.choices) {
    currentNode.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.classList.add("choice-btn");
      btn.textContent = choice.label;
      btn.onclick = () => goToNode(choice.next);
      choicesContainer.appendChild(btn);
    });
  }

  if (currentNode.end) {
    if (currentNode.end === "success") {
      alert("✅ You survived Stanley’s arc!");
    } else {
      alert("💀 Game Over. Refresh to try again.");
    }
  }
}

// Example: Hook into login message from iframe
window.addEventListener("message", (event) => {
  if (event.data?.action === "eli-connected") loadStory("eli");
  if (event.data?.action === "maya-connected") loadStory("maya");
  if (event.data?.action === "stanley-connected") loadStory("stanley");
});