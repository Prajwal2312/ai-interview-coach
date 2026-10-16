const $ = (id) => document.getElementById(id);

const questionBank = {
  "Frontend Developer": [
    {q:"What is the difference between let, const, and var in JavaScript?", tags:["JavaScript","Fundamentals"]},
    {q:"Explain the virtual DOM and why React uses it.", tags:["React","Performance"]},
    {q:"How would you optimize a web page that is loading slowly?", tags:["Performance","Web"]},
    {q:"What is event delegation and when would you use it?", tags:["JavaScript","DOM"]},
    {q:"Explain CSS specificity and how you resolve conflicting styles.", tags:["CSS","Fundamentals"]},
    {q:"What is the difference between controlled and uncontrolled components in React?", tags:["React","Forms"]},
    {q:"How would you make a web application responsive across devices?", tags:["CSS","Responsive Design"]},
    {q:"Explain REST APIs and the main HTTP methods you would use.", tags:["API","HTTP"]}
  ],
  "Backend Developer": [
    {q:"What is the difference between SQL and NoSQL databases, and when would you choose each?",tags:["Databases","Architecture"]},
    {q:"Explain REST API design and the purpose of HTTP status codes.",tags:["API","HTTP"]},
    {q:"What is database indexing and what trade-offs does it introduce?",tags:["DBMS","Performance"]},
    {q:"How would you design authentication for a production web application?",tags:["Security","Backend"]},
    {q:"Explain database transactions and the ACID properties.",tags:["DBMS","Transactions"]},
    {q:"What is caching and where can it be applied in a backend system?",tags:["Performance","Architecture"]}
  ],
  "Full Stack Developer": [
    {q:"Walk through what happens from entering a URL in a browser to receiving the page.",tags:["Web","Networking"]},
    {q:"How would you design a scalable full-stack application?",tags:["Architecture","Scalability"]},
    {q:"What is the role of middleware in a web application?",tags:["Backend","Middleware"]},
    {q:"How should frontend and backend validation work together?",tags:["Security","Validation"]},
    {q:"Explain JWT authentication and one security concern with it.",tags:["Auth","Security"]},
    {q:"How would you debug a slow API request?",tags:["Debugging","Performance"]}
  ],
  "Data Analyst": [
    {q:"What is the difference between INNER JOIN and LEFT JOIN in SQL?",tags:["SQL","Databases"]},
    {q:"How would you handle missing values in a dataset?",tags:["Python","Data Cleaning"]},
    {q:"Explain precision, recall, and when each is useful.",tags:["Statistics","ML"]},
    {q:"How would you communicate a data insight to a non-technical stakeholder?",tags:["Communication","Analytics"]},
    {q:"What is the difference between correlation and causation?",tags:["Statistics","Reasoning"]}
  ],
  "Machine Learning Engineer": [
    {q:"What is overfitting and how can you reduce it?",tags:["ML","Modeling"]},
    {q:"Explain the bias-variance trade-off.",tags:["ML","Statistics"]},
    {q:"When would you choose XGBoost over a neural network?",tags:["ML","Models"]},
    {q:"What is data leakage and why is it dangerous?",tags:["ML","Data"]},
    {q:"How would you evaluate an imbalanced classification model?",tags:["ML","Evaluation"]}
  ],
  "Software Engineer": [
    {q:"Explain the difference between a stack and a queue and give a practical use for each.",tags:["DSA","Fundamentals"]},
    {q:"What is time complexity and how would you analyze a binary search?",tags:["Algorithms","Complexity"]},
    {q:"Explain OOP principles with an example.",tags:["OOP","Programming"]},
    {q:"What is the difference between a process and a thread?",tags:["OS","Concurrency"]},
    {q:"How does a hash table work?",tags:["Data Structures","Hashing"]},
    {q:"Explain recursion and one situation where iteration may be preferable.",tags:["Algorithms","Recursion"]}
  ]
};

let state = {
  questions: [], current: 0, answers: [], session: null, timer: null, seconds: 120,
  history: JSON.parse(localStorage.getItem("interviewHistory") || "[]")
};

function initials(name){
  return (name || "Prajwal Halaharvi").split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase();
}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300)}
function showView(view){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active-view"));
  $(view+"View").classList.add("active-view");
  document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===view));
  $("pageTitle").textContent={dashboard:"Dashboard",interview:"Mock Interview",history:"Interview History",profile:"Profile"}[view];
}
document.querySelectorAll("[data-view]").forEach(btn=>btn.addEventListener("click",()=>showView(btn.dataset.view)));
$("startInterviewBtn").onclick=()=>showView("interview");

function renderHistory(){
  const box=$("historyRows");
  const demo=[
    {name:"Technical Interview",role:"Frontend Developer",questions:8,score:"8.6",date:"Sep 28, 2026"},
    {name:"DSA Practice",role:"Software Engineer",questions:10,score:"7.9",date:"Sep 25, 2026"},
    {name:"React Round",role:"Frontend Developer",questions:5,score:"9.1",date:"Sep 21, 2026"},
    ...state.history
  ];
  box.innerHTML=demo.map(x=>`<div class="history-row"><span><b>${x.name}</b></span><span>${x.role}</span><span>${x.questions}</span><span class="history-score">${x.score}/10</span><span>${x.date}</span></div>`).join("");
}
renderHistory();

$("setupForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  const role=$("role").value, total=Number($("questionTotal").value);
  const bank=[...(questionBank[role]||questionBank["Software Engineer"])];
  for(let i=bank.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bank[i],bank[j]]=[bank[j],bank[i]]}
  state.questions=bank.slice(0,Math.min(total,bank.length));
  state.current=0; state.answers=[]; state.session={name:$("candidateName").value.trim(),branch:$("branch").value.trim(),company:$("company").value.trim(),role};
  $("setupCard").classList.add("hidden"); $("feedbackCard").classList.add("hidden"); $("interviewCard").classList.remove("hidden");
  $("interviewRoleLabel").textContent=`${role.toUpperCase()} • ${state.session.company.toUpperCase()}`;
  loadQuestion();
});

function loadQuestion(){
  clearInterval(state.timer); state.seconds=120; updateTimer();
  const q=state.questions[state.current];
  $("questionHeading").textContent=`Question ${state.current+1}`;
  $("questionNumber").textContent=String(state.current+1).padStart(2,"0");
  $("questionText").textContent=q.q;
  $("questionTags").innerHTML=q.tags.map(t=>`<span>${t}</span>`).join("");
  $("answerInput").value=""; $("voiceStatus").classList.add("hidden");
  $("submitAnswerBtn").textContent=state.current===state.questions.length-1?"Finish interview →":"Submit answer →";
  state.timer=setInterval(()=>{state.seconds--;updateTimer();if(state.seconds<=0){clearInterval(state.timer);evaluateAnswer(true)}},1000);
}
function updateTimer(){$("timer").textContent=`${String(Math.floor(state.seconds/60)).padStart(2,"0")}:${String(state.seconds%60).padStart(2,"0")}`}
function evaluateAnswer(auto=false){
  clearInterval(state.timer);
  const answer=$("answerInput").value.trim();
  const words=answer.split(/\s+/).filter(Boolean).length;
  let score=auto?Math.max(4,Math.min(7,5+words/25)):Math.min(10,Math.max(4.5,6+Math.min(words,80)/45));
  if(/because|example|trade.?off|however|therefore|complexity|performance|security|testing/i.test(answer)) score+=.8;
  score=Math.round(Math.min(10,score)*10)/10;
  const strengths=words>=35?["Good level of detail and explanation.","Answer shows an attempt to structure the reasoning."]:["You identified the core topic.","The answer is concise and easy to follow."];
  if(/example/i.test(answer)) strengths.push("Uses an example to make the explanation clearer.");
  const weaknesses=words<25?["Add more detail and a concrete example.","Explain the reasoning behind your answer."]:["Make trade-offs and edge cases more explicit.","Use a clear structure: concept → example → trade-off."];
  if(auto) weaknesses.unshift("The response exceeded the available answer time.");
  $("answerScore").innerHTML=`${score}<span>/10</span>`;
  $("strengthsList").innerHTML=strengths.map(x=>`<li>${x}</li>`).join("");
  $("weaknessList").innerHTML=weaknesses.map(x=>`<li>${x}</li>`).join("");
  $("suggestionText").textContent="For a stronger interview answer, start with a one-sentence definition, explain how it works, give a short real-world example, and finish with a limitation or trade-off.";
  state.answers.push({question:state.questions[state.current].q,score,answer});
  $("interviewCard").classList.add("hidden");$("feedbackCard").classList.remove("hidden");
}
$("submitAnswerBtn").onclick=()=>evaluateAnswer(false);
$("skipBtn").onclick=()=>{state.answers.push({question:state.questions[state.current].q,score:0,answer:"Skipped"});nextQuestion()};
$("nextQuestionBtn").onclick=()=>nextQuestion();

function nextQuestion(){
  $("feedbackCard").classList.add("hidden");
  if(state.current<state.questions.length-1){state.current++;$("interviewCard").classList.remove("hidden");loadQuestion();}
  else finishInterview();
}
function finishInterview(){
  const valid=state.answers.filter(a=>a.score>0);
  const avg=valid.length?valid.reduce((s,a)=>s+a.score,0)/valid.length:0;
  const record={name:"Mock Interview",role:state.session.role,questions:state.questions.length,score:avg.toFixed(1),date:new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})};
  state.history.unshift(record);localStorage.setItem("interviewHistory",JSON.stringify(state.history));
  $("interviewCard").classList.add("hidden");$("feedbackCard").classList.add("hidden");$("setupCard").classList.remove("hidden");
  $("interviewCount").textContent=12+state.history.length;$("questionCount").textContent=58+state.answers.length;
  renderHistory();showView("dashboard");toast(`Interview complete — ${record.score}/10`);
}

$("textMode").onclick=()=>setMode("text");$("voiceMode").onclick=()=>setMode("voice");
function setMode(mode){
  $("textMode").classList.toggle("active",mode==="text");$("voiceMode").classList.toggle("active",mode==="voice");
  if(mode==="voice") startSpeech(); else $("voiceStatus").classList.add("hidden");
}
function startSpeech(){
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Recognition){toast("Voice input is not supported in this browser.");return}
  const recognition=new Recognition(); recognition.lang="en-US"; recognition.interimResults=true;
  $("voiceStatus").classList.remove("hidden");
  recognition.onresult=(e)=>{$("answerInput").value=Array.from(e.results).map(r=>r[0].transcript).join(" ")};
  recognition.onerror=()=>{$("voiceStatus").classList.add("hidden");toast("Voice recognition stopped.");};
  recognition.onend=()=>$("voiceStatus").classList.add("hidden");
  recognition.start();
}

$("continueBtn").onclick=()=>showView("history");
$("saveProfile").onclick=()=>{
  const name=$("profileName").value; $("avatar").textContent=initials(name);$("profileAvatar").textContent=initials(name);
  toast("Profile saved successfully.");
};
$("profileName").addEventListener("input",e=>{$("avatar").textContent=initials(e.target.value);$("profileAvatar").textContent=initials(e.target.value)});
