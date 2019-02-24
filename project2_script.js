const URL = 'https://api.coingecko.com/api/v3/coins/list';

let outputData = {};
let classToggleIndex = [];
let openedToggelSymbolsArr = [];
let toggleCounter = 0;


modaloutput = `<div class="modal" id="my-modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <h5 class="modal-title2"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div id="coinName"></div>
                <div id="coinImage"><img src=lg.colorful-progress-loader.gif></div>
                <div id="coinMarketData"></div>
                <div id="coinDescription"></div>
                <div id="openedToggels"></div>
            </div>
            <div class="modal-footer">
                <button type="button" id="closingModal" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>`


$("#modaloutput").html(modaloutput);


function getData(coinId){


    if (sessionStorage[coinId]==null){

        console.log(coinId + "     this one does not exisit in session storage");

        getCoinDataFromAPI(coinId);
    }else {

        let obj = JSON.parse(sessionStorage[coinId]);
        if(sessionStorage[coinId] != null && (Date.now() - obj.timeStamp) > 5000 )
        {
            console.log("data is old you should go to the api");
            sessionStorage.clear();
            getCoinDataFromAPI(coinId);
            console.log("now the data is updated");

        } else {
            let obj = JSON.parse(sessionStorage[coinId]);
            if (sessionStorage[coinId] != null && ( (Date.now() - obj.timeStamp) < 5000) ) {

                console.log("the data is still new. data is printed from sessionstorage last call for this coin was before"
                + (Date.now() - obj.timeStamp)/1000 + "  seconds");
                console.log(obj.name);
                $("#openedToggels").html("");
                $("#coinName").html(`SS<h3>${obj.name}</h3>`);
                $("#coinImage").html(`<img src=${obj.image}>`);
                $("#coinMarketData").html(`<p><div>USD Price:${obj.market_data.USD}$</div>
                                   <div>EUR Price: ${obj.market_data.EUR}<div style="display:inline">&#8364</div></div>
                                   <div>ILS Price: ${obj.market_data.ILS}<div style="display:inline">&#8362</div></div>
                   <p>`);
                // $("#coinDescription").html(`<h3> Sessionstorage</h3><p class="coinDescription">${obj.description}</p>`);
            }
        }
    }
}

function getCoinDataFromAPI(coinId) {
    console.log(coinId);
    const URL2 = 'https://api.coingecko.com/api/v3/coins/' + coinId;

    $.get(URL2, function (data, status) {

        currencyDataOBJ = JSON.parse(JSON.stringify(data));


        console.log(currencyDataOBJ);

        outputData = {
            name: currencyDataOBJ.name,
            symbol: currencyDataOBJ.symbol,
            id: currencyDataOBJ.id,
            description: currencyDataOBJ.description.en,
            image: currencyDataOBJ.image.large,
            market_data: {
                USD: currencyDataOBJ.market_data.current_price.usd,
                EUR: currencyDataOBJ.market_data.current_price.eur,
                ILS: currencyDataOBJ.market_data.current_price.ils
            },
            timeStamp : Date.now()

        }

        sessionStorage.setItem(coinId,JSON.stringify(outputData));
        $("#openedToggels").html("");
        $("#coinName").html(`<h3>${outputData.name}</h3>`);
        $("#coinImage").html(`<img src=${outputData.image}>`);
        $("#coinMarketData").html(`<p><div>USD Price: ${outputData.market_data.USD}$</div>
                                          <div>EUR Price: ${outputData.market_data.EUR}<div style="display:inline">&#8364</div></div>
                                          <div>ILS Price: ${outputData.market_data.ILS}<div style="display:inline">&#8362</div></div>
                   <p>`)
        //$("#coinDescription").html(`<p class="coinDescription">${outputData.description}</p>`);
    })
}

let currencyArr;
let outputCards = "";

$(document).ready (function () {
    $.get(URL, function (data, status) {
        currencyJSON = JSON.stringify(data);
        currencyArr = JSON.parse(currencyJSON);
        // console.log(currencyArr[1]);

        $.each(currencyArr, (index, value) => {

            if (index < 20) {
                outputCards += `<div class="card" style="width: 18rem; float:left; margin:3px;"><div>${index}</div>
                     <div><label style="float:right; display: inline" class="switch"><input type="checkbox" onclick="selectToggle('${index}')"><span class="slider round"></span></label></div>

                     <div style="position:relative">
                     <div class="card-body" style="display: inline;float:left">

                     <h4 style="font-weight: bold;" class="card-title">${value.symbol}</h4>
                     <h6 class="card-title">${value.name}</h6>
                     <p class="card-text"></p>

                     <button class="btn btn-primary" type="button" data-toggle="modal" data-target="#my-modal"
                     aria-expanded="false" onclick="getData('${value.id}')"
                     aria-controls="collapseExample">More info</button>

                                            </div>
                                      </div>
                                  </div>
                            </div>
                      </div>
                   </div>`
            } classToggleIndex[index]=false;


        });
        $("#currency").html(outputCards);
    });
});


let toggeleModal = "";

function selectToggle(index){

    if (classToggleIndex[index]  == false ){
        classToggleIndex[index] = true;
        toggleCounter++;
        openedToggelSymbolsArr.push(currencyArr[index].symbol);

    } else{
        classToggleIndex[index] = false;
        toggleCounter--;
        for (let i=0;i<openedToggelSymbolsArr.length;i++){
            if (openedToggelSymbolsArr[i] == currencyArr[index].symbol){
                openedToggelSymbolsArr.splice(i,1);
            }
         }
    };
    console.log("toggle counts= " + toggleCounter);

    if (toggleCounter > 0 ){

        console.log("toggle modal open");

        $("#my-modal").modal("show");

        let openedToggelsNames = "";
        $(classToggleIndex).each(function (index) {
            if (classToggleIndex[index] === true){

                console.log(currencyArr[index].name);
                openedToggelsNames +='<button id="opendtoggle" class="list-group-item list-group-item-action list-group-item-danger"><span>'+ currencyArr[index].name+'</span></button>';

            };
        });
        $("#openedToggels").html(openedToggelsNames);
        $("#coinImage").html("");
    }
}


$("#closingModal").click(function(){
    console.log("modal is closed")
    $(".modal-title").text("");
    $("#coinImage").html('<img src=lg.colorful-progress-loader.gif>');
    $("#coinMarketData").text("");
    $("#coinDescription").text("");
    $("#coinName").text("");
    $("#openedToggels").text("");

});



$(document).ajaxStart(function(){
    $("#wait").css("display", "block");
});
$(document).ajaxComplete(function(){
    $("#wait").css("display", "none");
});





//////////////

window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}