// SELECTING DOM ELEMENTS
const todoForm = document.querySelector("#todo-form");
const addTodoInput = document.querySelector("#todo");
const todoList = document.querySelector("ul.list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0]; // 0 index numaralı card-body class'lı div'i seçtik.
const secondCardBody = document.querySelectorAll(".card-body")[1]; // 1 index numaralı card-body class'lı div'i seçtik.
const filterInput = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners(); // Event Listenerlarımızı Çalıştırdık.

function eventListeners(){
    todoForm.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secondCardBody.addEventListener("click",deleteTodoUI);
    clearButton.addEventListener("click",clearAllTodos);
    filterInput.addEventListener("keyup",filterTodo);
}
function loadAllTodosToUI(e){
    let todos = getTodosFromStorage();
    todos.forEach(function(todo){
        addTodoToUI(todo);
    });
}
function clearAllTodos(e){
    if(confirm("Tüm To Do'ları Kaldırmak İstediğinize Emin misniz?"))
    {   //Clear UI
         //todoList.innerHTML = ""; - Bu yöntem Eğer Projeniz büyük ise yavaşlatır.
           while(todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild);
           } 
          showAlert("success","Tüm To Do'lar Kaldırıldı!");
        //Clear Storage
        localStorage.removeItem("todos");   
    }
}
function filterTodo(e){
    let filterInputValue = e.target.value.toLowerCase(); // filter input içerisnden value'muzu aldık ve küçük harf'e çevirdik.
    let listItems = document.querySelectorAll(".list-group-item"); // Tüm li'leri seçtik ve listItems değişkenine eşitledik.
   
    listItems.forEach(function(listItem){ // listItems içerisinde forEach methodu ile gezinmeye başladık
        let itemText = listItem.textContent.toLowerCase(); // Li'lerimizin text'ini aldık ve input value ile eşleşmesi için küçük harf'e çevirdik.
            if(itemText.indexOf(filterInputValue) === -1)
            {         //Bulamadığı Durum
                listItem.setAttribute("style","display : none !important ");              
            }
            else{
                listItem.setAttribute("style","display : block");  
            }
    });
}
function deleteTodoUI(e){ //ToDo Silen Func
        let willBeDel = e.target.parentElement.parentElement; // remove elementimizin parent elementinin parent elementini willBeDell değişkenine eşitle.
        let clicked = e.target; //target
        if(clicked.className === "fa fa-remove"){ //eğer target'ın class'ı remove elementimizin class'ına eşitse;           
            
            console.log("1 To Do Silindi!");
            willBeDel.remove(); //arayüzden ToDo'yu sil.
            showAlert("success","To Do Başarıyla Silindi.");
            deleteTodoStorage(willBeDel.textContent);   // Silinecek Todo'muzu storage'dan silme fonksiyonuna gönderdik.
        }
    
}
function deleteTodoStorage(deletedtodo){
        let todos = getTodosFromStorage(); // todo'larımızı local storage'dan çektik.
        todos.forEach(function(todo,index){ // todos arrayimiz içerisinde gezmeye başladık.
            if(todo === deletedtodo) // eğer todolardan birisi silinecek todo'ya eşit ise;
            {
                todos.splice(index,1); // o todo'nun index numarasına göre splice methodu ile silme işlemimizi yapıyoruz.
            }
        })
       localStorage.setItem("todos",JSON.stringify(todos));  // Güncel todos arrayimizi local storage'a tekrar gönderiyoruz.
}
function addTodo(e){
    const  newTodo = addTodoInput.value.trim();  //yeni todo için newTodo adından bir değişken oluşturduk ve addTodoInput'un value değerine eşitledik value değerinin boşluk karakterlerini almaması için string trim() methodunu kullandık.
    if(newTodo === "") // addTodoInput'umuz boş ise 
    {
        showAlert("danger","Lütfen Bir To Do Giriniz!");
    }else{
        showAlert("success","To Do Başarıyla Eklendi.");
        addTodoToUI(newTodo); // yeni oluşan todo'muzu arayüze eklemek için addTodoToUI() fonksiyonumuzu çalıştırıyoruz ve içerisine newTodo'muzu gönderiyoruz.    
        addTodoToStorage(newTodo);  // yeni oluşan todo'muzu Storage'a eklemek için addTodoToStorage() fonksiyonumuzu çalıştırıyoruz ve içerisine newTodo'muzu gönderiyoruz.    
    }
  
    e.preventDefault(); //Formumuz Submit Olduğunda Sayfanın yenilenmesini engelleyen methodumuz.
    addTodoInput.value = ""; // Ekleme İşlemimiz Bittiği İçin Inputumuzun İçerisini Boşalttık.
}


function showAlert(type,message){  //alert func
   if(type === "danger"){
    const alertEmpty = document.createElement("div");// alertEmpty div'ini oluşturduk.
    alertEmpty.className = `alert alert-${type}`; // className'i ni verdik.
    alertEmpty.textContent = message; // Text Olarak gelen message parametresini verdik.
    firstCardBody.appendChild(alertEmpty);// Alert'imizi firstcardbody'e son çocuk olarak ekledik.
    
    setTimeout(function(){
        alertEmpty.remove();
    },2000);
    }
    if(type === "success"){
        const alertSuc = document.createElement("div");// alert succes'ini oluşturduk.
        alertSuc.className = `alert alert-${type}`; // className'i ni verdik.
        alertSuc.textContent = message; // Text Olarak gelen message parametresini verdik.
        firstCardBody.appendChild(alertSuc);// Alert'imizi firstcardbody'e son çocuk olarak ekledik.
    
        setTimeout(function(){
            alertSuc.remove();
        },2000);
    }
}


function addTodoToUI(newTodo){  //String Değeri UI'a Ekleyecek Func.
  //List Item Oluşturma
  const newListItem = document.createElement("li"); // yeni bir li elementi oluşturduk.
  newListItem.className = "list-group-item d-flex justify-content-between";  //Yeni Li Elementimizin Attribute'larını verdik.
  //Link Oluşturma
   newLink = newListItem.appendChild(document.createElement("a")) // Yeni Li Elementimiz İçerisine a elementi oluşturduk ve newLink değişkenine eşitledik.
   //Yeni a elementimizin attribute'larını tanımlayalım.
   newLink.href = "#";
   newLink.className = "delete-item";
   newLink.innerHTML = "<i class = 'fa fa-remove'></i>"; // Remove Icon'u a elementimizin içerisine innerHTML ile ekledik.
    
   newListItem.appendChild(document.createTextNode(newTodo)); //List Item'a Text Node Olarak newTodo'muzu verdik.
   newListItem.appendChild(newLink); // Yeni linkimizi List İtem İçerisine Son Çocuk Olarak Ekledik.
   todoList.appendChild(newListItem); // Todo List içerisine newLıstItem'ı ekledik.
}

function getTodosFromStorage(){ //Local Storage'dan ToDo'ları alan func.
    let todos;

    if(localStorage.getItem("todos") === null){ //Local Storage'dan todos ıtem'ını getir todos ıtem null'a eşit ise
        todos = []; // todos'a boş bir array ata.
    }
    else{
         todos = JSON.parse(localStorage.getItem("todos")); // eğer todos var ise array'e çevir.
    }
    return todos;
}
function addTodoToStorage(newTodo){ //Todo'larımızı Array olarak Local Storage içerisine ekleyecek func.
     let todos = getTodosFromStorage(); //ToDO'muzu local Storage'dan çektik.
     
     todos.push(newTodo); // Yeni ToDo'yu todos array'i içerisine push'ladık.

     localStorage.setItem("todos",JSON.stringify(todos)); // todos'u JSON.stringify() methodu sayesinde sanki bir arraymiş gibi tekrardan Local Storage'a kaydettik. 
}

