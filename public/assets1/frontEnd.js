
$(document).ready(()=>{
    function mydate(date, time){
        const date_created={
            hr:new Date().getHours(),
            mn:new Date().getMinutes(),
            d:new Date().getDate(),
            y:new Date().getFullYear(),
            Mon:()=>{
              const month = new Date().getMonth()
              const myMon = ["Jan","Feb","Mach","April","May","Jun","July","Aug","Sep","Oct","Nov","Dec"];
              return myMon[month];
            },
            day:()=>{
                const day = new Date().getDay();
                const days =["Sun","Mon","Tue","wed","Thur","Fri","Sat"];
                return days[day];
            }
        };
    
        const data_created = ` ${date_created.day()} ${date_created.d}/${date_created.Mon()}/${date_created.y} `;
        date = data_created;
        const time_created = `${date_created.hr}:${date_created.mn}`;
         time_created;
         return ({time:time_created,date:data_created});
    }
   // let bigd = mydate();
   // console.log(bigd.date)
    
    /// note you need to use a normal function to access the html elements and attributes do  ot use arrow functions bcs  it refers to global window       
let editTodoSpan = $('.editTodoSpan');
let adStatus = $('#adStatus')
let addTodoErr = $('#addError')  
let editTodoForm = $('#editTodoForm');
let editTodoBtn = $('.editTodoBtn');
let todoUpdateBtn = $('#todoUpdateBtn');
let status = $('.status');
let addTodoForm = $('#addTodoForm');
let addTodoFormBtn = $('#addTodoBtn');
let addTodoToggleBtn =$('#addTodoToggleBtn')

let googlebtn = $("#googlebtn")

//google oaut2
googlebtn.click(()=>{
 
    console.log("in fronftEdn");
    const header = {}
    $.ajax({

        headers: {"Access-Control-Allow-Origin": "*"},
    // headers:{  "X-Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-reqed-With",
    // "Access-Control-Allow-Methods": "PATCH,POST,GET,PUT,DELETE,OPTIONS",
    // "Access-Control-Allow-Credentials": true,
    // "Access-Control-Allow-Headers":"Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    // }
        type:"get",
        url:'http://localhost/auth/google',
        success: function(data){   
        console.log(data)
        },
      
        error:function(data){
            console.log("rreor")
            alert("there was error");
            // location.reload();
        }
    })
})



status.change(function(){
    let thisDate = mydate()
    let status = $(this).val();
   if(confirm(`Set status to: ${status}?`)){
    let index = $(this).parent().attr('myindex');
    if(`${status}`==="Completed"){
        thisDate.date = thisDate.date;
    }else if(`${status}` ==="Inprogress"){
        thisDate.date = "Inprogress",
        thisDate.time= "progressing"
    }else{
        thisDate.date = "Forfited"
    }
    console.log(thisDate.date);
    let data = {
        index:index,
        status:status,
        completedDate: thisDate.date,
        timeCompleted :thisDate.time
    }
    
 
   // console.log(myspan);
    $.ajax({
        type:"post",
        url:'/ui',
        data:data,
        success: function(){   
             JSON.stringify(data)
             let index = data.index;
             let status = data.status;
           $(`#mytid${index}`).html(`${status}`).toggleClass(!`${status}`).addClass(`${status}`)
           $(`#statusDiv${index}`).html(`${status}`).toggleClass(!`${status}`).addClass(`${status}`)
        },
        error:function(data){
            alert("there was error");
            location.reload();
        }
    })
}
   
})

editTodoBtn.click ( function (){
        
        let id = $(this).parent().attr('myid');
        let initial_value = $(this).parent().attr('myitem');
        let index = $(this).parent().attr('myindex')
       let option = prompt(`Edit Todo : ${initial_value}`);
       if(!option) return
       let newitem = option;
      //maing ajax call to db with values
      let data = {
          item:newitem,
          id:id,
          index:index
      };
      $.ajax({
            type:'POST',
            url:'/edit',
            data:data,
            success:function(data){
                JSON.stringify (data.message);
                adStatus.text(data.message).addClass("btn-success")
                location.reload(data);
            },
            error: function(data){
                JSON.stringify(data);  
                adStatus.text(data.statusText).addClass("btn-danger");
                setTimeout(()=>{
                    adStatus.text("Try Again").removeClass("btn-danger").addClass("btn-secondary");
                },1000)
            }})
})




//add in todo 
addTodoForm.on('submit',()=>{
      let thisDate = mydate()

        const data = {
           item:$('#todo').val(),
           data_created: thisDate.date,
           time:$('#time').val()
          // completion_date: $('#completeDate').val()
        };
        //maing request
        $.ajax({
            type:'POST',
            url:'/addTodo',
            data:data,
            success:function(data){
                JSON.stringify (data.message)
                adStatus.text(data.message).addClass("btn-success")
                location.reload();
            },
            error: function(data){
                alert(JSON.stringify(data));   
                adStatus.text(data.statusText).addClass("btn-danger")
                location.data();
            }
         })})
        

        // Deletiing todoes
      
            $('.deletebtn').click(function(){
                const userConfirm = confirm(`Are you sure you want to delete todo`);
            if(userConfirm){
            $.ajax({
            type:'post',
            url:'/delete',
            data:{index:$(this).parent().attr('myindex')},
            success:function(data){ 
                alert("sucess removing todo"); 
                adStatus.text(data.message).addClass("btn-success")
                location.reload()   
            },
            error:function(data){
                alert('there was error carrrying out that task')
            }
        });
      }})






// :::::::: more details request

    $('.detailsbtn').click(function(){
        alert('detailsBtn');
        const userConfirm = confirm(`Are you sure you want to delete todo`);
    if(userConfirm){
    $.ajax({
    type:'post',
    url:'/delete',
    data:{index:$(this).val()},
    sucess:function(data){      
    }
});
location.reload();
}
})


    
    
 

// $('#watch').click(function(){
//   let vid =  $.get('/dbs/video',{
//         "content-Type":"video/mp4"
//     })
//     alert('video btn clicked');
// })
    // eddditing todo:::::::::::::::::::::::::::::
    
      

//     editTodoBtn.on('click',function(){
//     alert("clicked");
//     let editIndex= $(this).attr("myid");
//     $('.editForm').toggle(function(){
      
//       $(this).on('submit',function(){
//         let datas = {
//             editIndex:editIndex,
//             new_value:$('#editedTodo').val()
//         };
//             $.ajax({
//                 type:'post',
//                 url:'/edit',
//                 data:datas,
//                 sucess:function(data){  
//                     location.reload();
//                 }
//             });
//             location.reload();
//       });
//     });
// })


// end of document Ready function
})

