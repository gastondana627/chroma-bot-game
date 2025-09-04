// /game/graphEngine.js

class GraphEngine {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.story = null;
      this.currentNode = null;
    }
  
    async loadStory(storyPath) {
      try {
        const res = await fetch(storyPath);
        this.story = await res.json();
  
        // Apply theme from JSON
        document.body.className = this.story.theme.class;
  
        // Start at S1 (Stanley Login)
        this.goToNode("S1");
      } catch (err) {
        console.error("Error loading story:", err);
      }
    }
  
    goToNode(nodeId) {
      const node = this.story.nodes[nodeId];
      if (!node) {
        console.error(`Node ${nodeId} not found`);
        return;
      }
  
      this.currentNode = node;
  
      // Load scene HTML into container
      fetch(node.scene)
        .then(res => res.text())
        .then(html => {
          this.container.innerHTML = html;
          this.bindChoices(node);
        })
        .catch(err => console.error("Error loading scene:", err));
    }
  
    bindChoices(node) {
      if (node.end) {
        this.showEnding(node.end, node.narration);
        return;
      }
  
      const buttons = this.container.querySelectorAll("[data-choice]");
      buttons.forEach((btn, i) => {
        btn.addEventListener("click", () => {
          const choice = node.choices[i];
          if (choice && choice.next) {
            this.goToNode(choice.next);
          }
        });
      });
    }
  
    showEnding(type, text) {
      this.container.innerHTML = `
        <div class="ending ${type}">
          <h2>${type === "success" ? "✅ Success" : "❌ Failure"}</h2>
          <p>${text}</p>
          <button onclick="window.location.reload()">Restart</button>
        </div>
      `;
    }
  }
  
  // --- Initialize Engine ---
  document.addEventListener("DOMContentLoaded", () => {
    const engine = new GraphEngine("game-container");
    engine.loadStory("./stories/stanley.json");
  });