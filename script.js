const allSideMenu = document.querySelectorAll("#sidebar .side-menubar.top li a");

allSideMenu.forEach(item=> {

    const li = item.parentElement;

    item.addEventListener('click', function () {
        allSideMenu.forEach(i=> {
            i.parentElement.classList.remove('active');
        })
    }
)
});

//toggle sidebar

const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
});

const searchButton = document.querySelector("#content nav form .form-input button");
const searchButtonIcon = document.querySelector("#content nav form .form-input button .bx");
const searchForm = document.querySelector("#content nav form");

searchButton.addEventListener('click', function (e) {
    if(window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        if(searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
        }
    }
})

if(window.innerWidth < 768) {
    sidebar.classList.add('hide');
} else if (window.innerWidth > 576) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    searchForm.classList.remove('show');
}

window.addEventListener('resize', function () {
    if(this.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
})


const switchMode = document.getElementById('swith-mode');

switchMode.addEventListener('change', function () {
    if(this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
})

/* Configuração para clima */ 
let chave = "95b21e4252bb169915cd54982dc75099";

        function colocarNaTela(dados) {
            console.log(dados); // Verifique se os dados estão sendo retornados corretamente

            const descricaoTempo = dados.weather[0].description; // Exemplo: "nuvens dispersas"
            const iconeClima = dados.weather[0].icon; // Exemplo: "04d"
            
            console.log("Descrição do tempo:", descricaoTempo);
            console.log("Ícone do clima:", iconeClima);

            // Exibe as informações da cidade
            document.querySelector(".cidade").innerHTML = "Tempo em " + dados.name;
            document.querySelector(".temp").innerHTML = Math.floor(dados.main.temp) + "°C";
            
            // Exibe a descrição detalhada do clima
            document.querySelector(".text-previsao").innerHTML = descricaoTempo.charAt(0).toUpperCase() + descricaoTempo.slice(1);
            
            // Exibe o ícone do tempo
            document.querySelector(".icone").src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}.png`;
            
            // Exibe a umidade
            document.querySelector(".umidade").innerHTML = dados.main.humidity + "% de umidade";

            // Condicional para exibir a descrição detalhada do clima (nublado, chovendo, céu limpo)
            let condicaoDetalhada = "";
            if (descricaoTempo.includes("cloud")) {
                condicaoDetalhada = "Nublado";
            } else if (descricaoTempo.includes("rain")) {
                condicaoDetalhada = "Chuvoso";
            } else if (descricaoTempo.includes("clear")) {
                condicaoDetalhada = "Céu Limpo";
            } else {
                condicaoDetalhada = descricaoTempo.charAt(0).toUpperCase() + descricaoTempo.slice(1);
            }
            document.querySelector(".condicao").innerHTML = condicaoDetalhada;
        }

        async function buscarCidade(cidade) {
            try {
                let dados = await fetch("https://api.openweathermap.org/data/2.5/weather?q=" +
                    cidade +
                    "&appid=" +
                    chave +
                    "&lang=pt_br" +
                    "&units=metric")
                    .then(resposta => resposta.json());

                // Verifica se a cidade foi encontrada
                if (dados.cod === "404") {
                    alert("Cidade não encontrada. Tente novamente.");
                } else {
                    colocarNaTela(dados);
                }
            } catch (error) {
                alert("Erro ao buscar dados. Tente novamente.");
            }
        }

        function cliqueiNoBotao() {
            let cidade = document.querySelector(".input-cidade").value;
            if (cidade) {
                buscarCidade(cidade);
            } else {
                alert("Por favor, insira o nome da cidade.");
            }
        }


// Função para atualizar o status de irrigação
function updateDashboard(moisture, isWatering) {
    moistureValueElement.textContent = moisture;

    if (isWatering) {
        wateringStatusElement.textContent = 'Ligado';
        wateringStatusElement.style.color = 'red';
        toggleButton.textContent = 'Parar Irrigação';
    } else {
        wateringStatusElement.textContent = 'Desligado';
        wateringStatusElement.style.color = 'green';
        toggleButton.textContent = 'Iniciar Irrigação';
    }
}

// Enviar requisição para iniciar ou parar a irrigação
toggleButton.addEventListener('click', () => {
    fetch('/toggle-watering', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            updateDashboard(data.moisture, data.isWatering);
        });
});

// Atualização contínua do nível de umidade
setInterval(() => {
    fetch('/moisture-level')
        .then(response => response.json())
        .then(data => {
            updateDashboard(data.moisture, data.isWatering);
        });
}, 5000);
