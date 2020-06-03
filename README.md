# Facilita (Back-end)

### Projeto Pessoal

*API RESTful para o projeto Facilita.*

Facilita é um projeto que tem como público o pequeno varejista. Ele permite que o lojista exponha seus produtos, que então ficam visíveis para os usuários da plataforma. Toda a interface é por meio do aplicativo Android (em contrução).

Os dados são armazenados em uma conta pessoal do MongoDB, devido a disponibilidade gratuita e imediata.

**Funcionalidade: cadastro, login e validações.**

A API utiliza uma lógica de usuário bivalente, ou seja, pode atuar como "lojista" ou como "cliente". Ao realizar o login, um JWT é gerado e enviado na resposta da validação. Com este token que as demais funcionalidades estão liberadas. As chaves são armazenadas em variáveis de ambiente, que não estão neste repositório.

**Funcionalidade: criação de catálogo.**

O usuário do tipo "lojista" pode realizar cadastro de itens, que possuem nome, descrição, preço e imagem. A imagem é hospedada em via CDN com a Cloudinary.

**Funcionalidade: buscas.**

O usuário do tipo "cliente" realiza buscas, salva lojistas como favoritos, envia avaliações e pode entrar em contato com os lojistas

**Deploy**

Esta API está disponível no Heroku. A versão disponível neste repositório não está completa, visto que o projeto total (API + Mobile) ainda está em andamento.


**Projeto idealizado por Bruno Santos, engenheiro químico, professor e programador.**

*Este é um repositório para compor portfólio.*

*Projeto Node*

*Contato para sugestões, críticas e melhorias: bruno.ajsch@yahoo.com*