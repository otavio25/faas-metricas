<h1> Function as a Service (FaaS) com Node.js</h1>

<p> Esse projeto tem por finalidade criar e testar localmente funções serverless. As funções serverless retornam as palavras mais frenquentes de cada ano. O arquivo <strong>papers.json</strong> são exemplos de publicações acadêmicas, que são usados pelas funções traçar as métricas.</p>

<h1> Módulo awsLambda </h1>
<h2>Dependências necessárias do projeto na pasta <strong>/lambda</strong></h2>
<ul>
    <li> Node.js </li>
    <li> Serveless Framework </li>
    <li> Credenciais da conta AWS </li>
</ul>

```
$ cd lambda
$ npm install
$ npm install --save aws-sdk
```

<h2>Testando a primeira execução</h2>

```
$ serverless invoke local --function handler
```
 ou

```
$ serverless offline
```

<h2> Deploy da função na AWS </h2>
<p> É necessário configurar um usuário na sua conta da AWS e adicionar as seguintes políticas de permissões : </p>
<ul>
    <li>AWSCloudFormationFullAccess	</li>
    <li>AWSLambda_FullAccess</li>
    <li>CloudWatchLogsFullAccess</li>
    <li>IAMFullAccess</li>
</ul>

Também é necessário criar na sua conta AWS **access key ID** e **Secret access key**.

<p> Após essas configurações execute o comando: </p>

```
serverless config credentials --provider **provider** --key **access key ID** --secret **Secret access key**
```

<p> Após isso faça deploy da função.</p>

```
$ serverless deploy
```

<h1> Módulo googleFunction </h1>
<p> Esse módulo foi implantado diretamente no Google Cloud dentro da plataforma Google Function. Porém é possível realizar as devidas requisições na função, basta acessar o módulo <strong>backend</strong> onde está configuradaa a rotaa para o acesso na função. Apenas defina um arquivo .env, e adicione a variável <strong>PAPERS</strong> com valor igual ao path do arquivo <strong>papers.json</strong>.</p>