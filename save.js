// save.js

export function setupSaveLoad(messagesContainer) {
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "💾 Save Game";
    const loadBtn = document.createElement("button");
    loadBtn.textContent = "📂 Load Game";
  
    document.body.appendChild(saveBtn);
    document.body.appendChild(loadBtn);
  
    saveBtn.addEventListener("click", () => {
      const logs = [...messagesContainer.querySelectorAll("p")].map(p => p.innerText);
      const blob = new Blob([JSON.stringify({ chat: logs }, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "chatlog.json";
      a.click();
    });
  
    loadBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";
      input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = JSON.parse(ev.target.result);
            if (data.chat) {
              messagesContainer.innerHTML = "";
              data.chat.forEach(msg => {
                const p = document.createElement("p");
                p.innerText = msg;
                messagesContainer.appendChild(p);
              });
            }
          } catch (err) {
            alert("Invalid save file");
          }
        };
        reader.readAsText(file);
      });
      input.click();
    });
  }