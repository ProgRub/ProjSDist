## Vue Events Bulletin Board

This is the code for the Vue.js [tutorial on Scotch.io](https://scotch.io/tutorials/build-a-single-page-time-tracking-app-with-vue-js-introduction). In the tutorial we build a events bulletin board application and cover the basics of [Vue](http://vuejs.org/).

## Aplicação num _container Docker_

1. git clone https://github.com/ProgRub/ProjSDist
2. cd ProjSDist
3. Pode-se usar a GitHub Action “docker-app-locally” para fazer os passos abaixo (4 - 8) 
automaticamente, através do comando de ajuda act.
4. docker network create bb-app
5. docker volume create bb-vol
6. docker run -d --network bb-app --network-alias postgres-development -v bb-vol:/var/lib/postgres -e POSTGRES_PASSWORD=secret --name postgres postgres:latest 
7. docker build --tag bulletinboard:1.0 .
8. docker run --publish 8000:8080 --detach --network bb-app -e 
POSTGRES_HOST=postgres-development -e POSTGRES_USER=postgres -e 
POSTGRES_PASSWORD=secret --name bb bulletinboard:1.0
9. Testar localmente: localhost:8000
10. docker stop bb
11. docker stop postgres
12. docker rm bb
13. docker rm postgres



## Aplicação no _Azure Container Registry_
ATENÇÃO: Se preferirem não criar o grupo de recursos e kubernetes por já terem criado, alterem o bulletinboard.yaml para fazer pull da imagem progrub/bulletinboard:1.0 em vez de projetosdregisto... NO ENTANTO, precisam de criar o fileshare na mesma.

14. Em portal.azure.com, 
* no menu de Recursos, selecione Criar recurso, escolha Contentores e depois Registo de 
contentores
* Para Grupo de recursos, selecione um grupo existente ou criar novo
* Escolha um nome para o registo: projetosdregisto
* Escolha a localização ou deixe o valor por defeito;
* Rever+Criar 
* Depois de estar criado o recurso, escolha Ir para o Recurso
* No menu, em Definições escolha Chaves de acesso
* Selecione o utilizador Admin e tome nota do nome do registo<registry-name>, do server 
de login <loginServer> e das credenciais: username, password e password2
 
Com o grupo de recursos criado e o Azure Container Registry, podemos colocar a 
imagem online no registo de contentores, através da action “docker-app-publish-acr” ou fazer 
o seguinte procedimento manualmente:
 
15. Localmente no terminal: 
* docker tag bulletinboard:1.0 projetosdregisto.azurecr.io/bulletinboard:1.0
* docker image ls, para confirmar que a imagem foi criada com a tag correcta.
* Faça login no azure: docker login projetosdregisto.azurecr.io
 
    Username: projetosdregisto
 
    Password: <>password ou password2<>
 
* docker tag bulletinboard:1.0 projetosdregisto.azurecr.io/bulletinboard:1.0
 
Para verificar que a imagem foi publicada com sucesso, no portal do Azure voltamos ao 
Azure Container Registry e em Serviços e em Repositórios, as imagens necessárias deverão
estar lá. Com a imagem publicada online, podemos criar o cluster Azure Kubernetes Service 
para poder publicar a aplicação. Para este fim executou-se o seguinte procedimento
 
 16. Crie um AKS cluster usando o portal do Azure:
* Selecione Criar recurso, escolha Contentores e depois Kubernetes Service e Criar.
* Escolha o Grupo de recursos já criado e atribua um nome ao cluster 
(projetosdkubernetes). Número de nós: mínimo 1, máximo 2.
* Nos passos seguintes pode manter tudo por defeito, exceto em Integrações, onde deve 
indicar o nome do Registo de contentores criado anteriormente.
* Rever+Criar 
 

 17. Crie uma storage account no Azure se ainda não tiver.

 18. Crie um file share na sua storage account com o nome projetosdfileshare.
 
 19. No VS Code, faça Ctrl+Shift+P e selecione Azure: Abrir Bash em Cloud Shell, ou no 
shell.azure.com, e ligue-se ao cluster: 
* az aks get-credentials --resource-group projetosd --name projetosdkubernetes
* kubectl create secret generic azure-secret --from-literal=azurestorageaccountname=<nome da storage account> --from-literal=azurestorageaccountkey=<chave da storage account>
* kubectl get nodes
* Usando nano ou vi, crie e abra um ficheiro chamado bulletinboard.yaml
* Copie o conteúdo do ficheiro bulletinboard_aks_fileshare.yaml do Github e cole no 
ficheiro aberto em nano ou vi. Guarde e feche o ficheiro.
* Execute kubectl apply -f bulletinboard.yaml
* Quando o serviço estiver pronto ser-lhe-á atribuído um IP externo, que poderá ser obtido 
através do comando kubectl get services, através do qual poderá testar o bulletinboard 
no browser: EXTERNAL-IP:8080
 
Se a aplicação foi publicada com sucesso, então, ao aceder ao EXTERNAL-IP obtido no 
último passo efetuado, a aplicação deverá estar funcional da mesma maneira que estava 
funcional na primeira parte (num container Docker local).
 
 
## Aplicação no cluster de Raspberry Pi's
 
 Por fim, para implementar o sistema num cluster de Raspberry Pi’s local, com recurso a 
uma versão mais leve do Kubernetes, o K3S, fez-se os seguintes passos:

 20. git clone https://github.com/ProgRub/ProjSDist

 21. cd ProjSDist

 22. kubectl apply -f bulletinboard_cluster.yaml

 23. kubectl get services
 
 Tal como na implementação com AKS, o último comando retorna o IP pelo qual podemos 
aceder à nossa aplicação, da seguinte maneira, num web browser: EXTERNAL-IP:8080

 
 
