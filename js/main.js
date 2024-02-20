const pwShowHide = document.querySelectorAll(".pw_hide"),
      home = document.querySelector(".home"),
      username = document.querySelector("#user"),
      pass = document.querySelector("#pass"),
      buttonLogin = document.querySelector("#login-button"),
      formOpenBtn = document.querySelector("#login-picture"),
      formContainer = document.querySelector(".form_container"),
      formCloseBtn = document.querySelector("#form_close");

let id;
let current_session = 0;
let current_user = 0;
localStorage.setItem("session", lightdm.get_default_session);
const user = username.textContent;


const optionMenu = document.querySelector(".select-menu"),
  selectBtn = optionMenu.querySelector(".select-btn"),
  
  sBtn_text = optionMenu.querySelector(".sBtn-text");

selectBtn.addEventListener("click", () =>
  optionMenu.classList.toggle("active")
);



pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil--eye-slash", "uil--eye")
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil--eye", "uil--eye-slash");
    }
  });
});

formOpenBtn.addEventListener("click", () => home.classList.add("show"));
formOpenBtn.addEventListener("click", list_users());
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));
buttonLogin.addEventListener("click", function(evt){

   evt.preventDefault();
   
   provide_secret();
  
});

  function show_error(msg)
{
  document.querySelector("#messages").innerText = msg;
	
}

function show_message(msg)
{
	document.querySelector("#messages").innerText = msg;
}

function display_user_picture(current_user){

  

  document.getElementById("login-picture").style.opacity = 0;

      setTimeout(function(){
        document.getElementById("login-picture").src = lightdm.users[current_user].image;
        document.getElementById("login-picture").addEventListener("load", function(){
          document.getElementById("login-picture").style.opacity = 1;
        });
      }, 350);
      var username = lightdm.users[current_user].name;
      document.getElementById("user").textContent = username;
      lightdm.start_authentication(lightdm.users[current_user].name);
      document.getElementById("pass").focus();
    }

function select_user(i){
  
  home.classList.remove("show");
  document.getElementById("login-picture").src = lightdm.users[i].image;
  
  document.getElementById("user").textContent = lightdm.users[i].name;
  lightdm.start_authentication(lightdm.users[i].name);
  current_user = i;
}

function list_users(){
  

    for(let i = 0; i < lightdm.users.length; i++) {
      
        
      document.getElementById("user_form").insertAdjacentHTML('afterend' ,`
            <table border="0" bgcolor="white">
            <tr>
            <td>
  					<img id="user-picture" draggable="false" src="static/profile.png" type="img-button"></img>
            </td>
            <td><span id="user_name"></span></td>
            </tr></table>
            `
          );
           
          document.getElementById("user-picture").src = lightdm.users[i].image;
          document.querySelector("#user_name").textContent = lightdm.users[i].name;
          document.getElementById("user-picture").addEventListener('click', function()
          {
            select_user(i);
          });

        
        }
        
       
        

}
document.onreadystatechange = () => {
  if (document.readyState == "complete") {
  const options = optionMenu.querySelectorAll(".option");
  
  options.forEach((option) => {
    
    option.addEventListener("click",  () => {
      
      let selectedOption = option.querySelector(".option-text").innerText;
      sBtn_text.innerText = selectedOption;
  
     optionMenu.classList.remove("active");
     
     
     current_session = selectedOption;
    
    });
  });
}
}

function start_authentication(){
   
   
    lightdm.start_authentication(user);
    
    show_message("Starting authentication");
    
    provide_secret();
}


function provide_secret()
{
  	let password = pass.value || null;
  	if(password !== null) {
        lightdm.provide_secret(password);
    } else {
      lightdm.cancel_authentication();
      display_user_picture(current_user);
      show_message("Insert password");
    }
}

function authentication_complete()
{
    if (lightdm.is_authenticated) {
    	
	lightdm.login(lightdm.authentication_user, current_session);
    
  } else {
   	
    	lightdm.cancel_authentication();
      display_user_picture(current_user);
      show_message("Invalid password");
   	}

}

function populate_drop_down(){

 lightdm.sessions.forEach(function(session, index){
  
  
  
  
    let session_name = lightdm.sessions[index].key;
    
    document.getElementById("list").insertAdjacentHTML("beforeend", `
  <li class="option">
                <span class="option-text">`+session_name+`</span>
              </li>`);
  
 });
 
}
function get_default_session(){
  return lightdm.get_default_session;
}

function init()
{
    
    display_user_picture(current_user);
    populate_drop_down();
    



}

init();
