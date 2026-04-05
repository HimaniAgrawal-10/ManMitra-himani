// ===== AUTH =====
function register() {
  const u = document.getElementById("regUser").value;
  const p = document.getElementById("regPass").value;
  if (!u || !p) return alert("Fill all fields");
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.find(x => x.user === u)) return alert("User exists!");
  users.push({ user: u, pass: p });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registered! Please login.");
  window.location = "login.html";
}
function login() {
  const u = document.getElementById("loginUser").value;
  const p = document.getElementById("loginPass").value;
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  let found = users.find(x => x.user === u && x.pass === p);
  if (!found) return alert("Invalid credentials");
  localStorage.setItem("currentUser", u);
  window.location = "index.html";
}
function logout() {
  localStorage.removeItem("currentUser");
  window.location = "login.html";
}

// ===== HELPERS =====
function save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function load(key) { return JSON.parse(localStorage.getItem(key) || "[]"); }

// ===== NAVIGATION =====
function navigate(view) {
  const content = document.getElementById("content");
  if (!content) return;

  // HOME
  if (view === "home") {
    const bookings = load("bookings");
    const posts = load("forumPosts");
    const chats = load("chatLogs");
    const quotes = ["🌟 You are stronger than you think.","💡 Small steps every day create big change.","❤️ It’s okay to ask for help.","🌈 Every day is a fresh start."];
    const quote = quotes[Math.floor(Math.random()*quotes.length)];
    content.innerHTML = `
      <h2>Welcome to ManMitra Lite</h2><p>${quote}</p>
      <div class="dashboard-grid">
        <div class="card" onclick="navigate('chat')">💬 Open Chat</div>
        <div class="card" onclick="navigate('screening')">📝 Take Screening</div>
        <div class="card" onclick="navigate('booking')">📅 Make Booking</div>
      </div>
      <div class="dashboard-grid">
        <div class="card"><h3>Quick Tools</h3>
          <button onclick="startBreathing()">🌬️ Breathing</button>
          <button onclick="startMeditation(60)">🧘 Grounding</button>
          <button onclick="playRelaxation()">🎶 Relax Music</button>
        </div>
        <div class="card"><h3>Recent Activity</h3>
          <p>${chats.length?"New chat logged":"No chats"}</p>
          <p>${bookings.length?`Latest booking with ${bookings.at(-1).doctor}`:"No bookings"}</p>
          <p>${posts.length?`Forum post: ${posts.at(-1).text}`:"No forum posts"}</p>
        </div>
      </div>`;
    return;
  }

  // CHAT
  if (view === "chat") {
    const logs = load("chatLogs");
    content.innerHTML = `<h2>Chatbot</h2>
      <div class="chat-box">${logs.map(m=>`<div class="message ${m.sender}"><b>${m.sender}:</b> ${m.text}</div>`).join("")}</div>
      <input id="chatInput" placeholder="Type message"><button onclick="sendChat()">Send</button>`;
    return;
  }

  // SCREENING
  if (view === "screening") {
    content.innerHTML = `<h2>Screening</h2>
      <p>Felt anxious this week?</p><select id="q1"><option value=0>Never</option><option value=1>Sometimes</option><option value=2>Often</option></select>
      <p>Felt low mood?</p><select id="q2"><option value=0>Never</option><option value=1>Sometimes</option><option value=2>Often</option></select>
      <button onclick="submitScreening()">Submit</button><div id="screeningResult"></div>`;
    return;
  }

  // BOOKING
  if (view === "booking") {
    const bookings = load("bookings");
    content.innerHTML = `<h2>Booking</h2>
      <input id="doctor" placeholder="Doctor Name"><input id="date" type="date">
      <button onclick="bookSession()">Book</button>
      <h3>My Bookings</h3><ul>${bookings.map(b=>`<li>${b.doctor} on ${b.date}</li>`).join("")}</ul>`;
    return;
  }

  // RESOURCES
  if (view === "resources") {
    content.innerHTML = `<h2>Resources</h2><ul>
      <li><a href="https://www.who.int/health-topics/mental-health" target="_blank">WHO</a></li>
      <li><a href="https://www.mind.org.uk/" target="_blank">Mind.org</a></li></ul>;
     <h3>Relaxation & Mindfulness Videos 🎥</h3>
    <div class="video-container">
      <iframe width="300" height="200" src="https://www.youtube.com/embed/2OEL4P1Rz04" frameborder="0" allowfullscreen></iframe>
      <iframe width="300" height="200" src="https://www.youtube.com/embed/ZToicYcHIOU" frameborder="0" allowfullscreen></iframe>
      <iframe width="300" height="200" src="https://www.youtube.com/embed/aEqlQvczMJQ" frameborder="0" allowfullscreen></iframe>
  <h3>🧘 Yoga & Meditation Videos</h3>
    <div class="video-container">
      <!-- Yoga -->
      <iframe src="https://www.youtube.com/embed/v7AYKMP6rOE" frameborder="0" allowfullscreen></iframe>
      <iframe src="https://www.youtube.com/embed/4pKly2JojMw" frameborder="0" allowfullscreen></iframe>

      <!-- Meditation -->
      <iframe src="https://www.youtube.com/embed/inpok4MKVLM" frameborder="0" allowfullscreen></iframe>
      <iframe src="https://www.youtube.com/embed/ZToicYcHIOU" frameborder="0" allowfullscreen></iframe>
    </div>
    `;
    return;
  }

  // FORUM
  if (view === "forum") {
    const posts = load("forumPosts");
    content.innerHTML = `<h2>Forum</h2>
      <textarea id="postText"></textarea><button onclick="addPost()">Post</button>
      <ul>${posts.map(p=>`<li><b>${p.user}:</b> ${p.text}</li>`).join("")}</ul>`;
    return;
  }

  // MOOD
  if (view === "mood") {
    const moods = load("moods");
    content.innerHTML = `<h2>Mood Journal</h2>
      <select id="moodSelect"><option>😊 Happy</option><option>😟 Anxious</option><option>😔 Sad</option><option>😂 Facing Tears of joy<option/><option>😠 Angry Face<option/><option>😴 Sleeping Face<option/><option>🤔 Thinking face<option/><option>😱Shocked Face<option/><option>🤨 Face with raised eyebrow<option/></select>
      <button onclick="saveMood()">Save</button>
      <ul>${moods.map(m=>`<li>${m.date}: ${m.mood}</li>`).join("")}</ul>`;
    return;
  }

  // ADMIN
  if (view === "admin") {
    const users = JSON.parse(localStorage.getItem("users")||"[]");
    content.innerHTML = `<h2>Admin</h2><ul>${users.map(u=>`<li>${u.user}</li>`).join("")}</ul>`;
    return;
  }
}

// ===== FEATURE LOGIC =====
function sendChat() {
  const input=document.getElementById("chatInput");
  if(!input.value) return;
  const logs=load("chatLogs");
  logs.push({sender:"user",text:input.value});
  // smarter bot reply
  let reply="Thanks for sharing ❤️";
  if(input.value.includes("sad")) reply="I’m sorry you feel sad. Remember, it’s okay to take breaks 💙";
  if(input.value.includes("happy")) reply="That’s wonderful! Keep smiling 🌟";
  if(input.value.includes("angry")) reply="Sorry to hear that,can you tell me what made you feel angry?";
if(input.value.includes("surprised")) reply="Wow,that's amazing!!";
if(input.value.include("I want to commit sucide")) reply="Oh this is wrong desicion! pls tell me your reason of sucide";
  
if(input.value.includes("fearful")) reply="Hey,what's making you feel fearful?I'm here to listen and help if I can. ";
  
if(input.value.includes("excited")) reply="Yay!What's got you so pumped up?tell me more!";
  
if(input.value.includes("love")) reply="Aww,that's beautiful!What's making your heart feel so full of love?";
  
if(input.value.includes("frusted")) reply="What's frustrating you?want to talk about it and see if we can figure something out together ? ";
  
if(input.value.includes("confused")) reply="What's confusing you?Let's break it down together and try to figure it out!";
  
if(input.value.includes("Proud")) reply="That's awesome! What are you proud of?Share your accomplishment!";
  
if(input.value.includes("jealous")) reply="Hey,that's a tough emotion.Want to talk about what's making you feel jealous?Sometimes sharing can help.";
  
if(input.value.includes("bored")) reply="Let's shake things up! Want to play a game, watch a funny video, or talk about something random?";
  
if(input.value.includes("guilty")) reply="Want to talk about what's weighing on your mind? Sometimes sharing can help clear the air. ";
  
if(input.value.includes("feel well")) reply= "Awesome! What's contributing to your well-being? Want to celebrate or share what's going right?";
if(input.value.includes(" not well")) reply=  "Sorry to hear that. What's going on? Hope you're taking care of yourself. Need any suggestions or just someone to talk to?" ;

if(input.value.includes("peace")) reply= "Serene vibes! What's bringing you peace? Want to bask in the calmness a bit longer?" ;

if(input.value.includes("relax")) reply=  "Chill vibes! Enjoying some downtime? Want to unwind further or talk about what's relaxing you?";

if(input.value.includes(" rest")) reply= "Recharge mode activated! Hope you're getting some good rest. Need anything or just enjoying the calm?";

if(input.value.includes("inspired")) reply=  "Sparked creativity! What's inspiring you? Want to share your ideas or brainstorm together?";

if(input.value.includes("depress")) reply=  "I'm here for you. Want to talk about what's going on? Sometimes sharing can help. If you need resources or just someone to listen, I'm here.";


  


  logs.push({sender:"bot",text:reply});
  save("chatLogs",logs); navigate("chat");
}
function submitScreening() {
  const score=Number(q1.value)+Number(q2.value);
  screeningResult.innerHTML=score>=3?"⚠️ Consider seeking support.":"✅ You seem okay.";
}
function bookSession() {
  const doctor=doctor.value,date=date.value;
  if(!doctor||!date) return alert("Fill all");
  const bookings=load("bookings"); bookings.push({doctor,date});
  save("bookings",bookings); navigate("booking");
}
function addPost() {
  const text=postText.value; if(!text) return;
  const posts=load("forumPosts");
  posts.push({user:localStorage.getItem("currentUser")||"guest",text});
  save("forumPosts",posts); navigate("forum");
}
function saveMood() {
  const mood=moodSelect.value;
  const moods=load("moods"); moods.push({mood,date:new Date().toLocaleDateString()});
  save("moods",moods); navigate("mood");
}
function startBreathing(){ alert("🌬️ Inhale 4s, Hold 4s, Exhale 4s."); }
function startMeditation(sec){ alert(`🧘 ${sec}s meditation started.`); }
function playRelaxation(){ new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3").play(); }

// Default
if(document.getElementById("content")) navigate("home");
