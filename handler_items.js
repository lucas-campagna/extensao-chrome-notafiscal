const btn_copy_items = document.getElementById('copy-items');
const btn_donwload_items = document.getElementById('download-items');

function coletar_itens(args) {
    console.log('coletar_itens ' + args);
    if (/www4\.fazenda\.\w\w\.gov\.br/.test(window.location.hostname)) {
        const itens_campos = ['nome', 'codigo', 'quantidade', 'unidade', 'valor_unitario', 'valor_total', 'nota_chave'];
        const sep = ';';

        const nota_chave = document.querySelector('.chave').innerText;

        let lista_de_itens = [...document.querySelectorAll('tbody > tr')].map(e => ({
            nome: e.querySelector(".txtTit").innerText,
            codigo: e.querySelector(".RCod").innerText.match(/\d+/g)[0],
            quantidade: e.querySelector(".Rqtd").innerText.match(/\d+((,|\.)\d+)?/g)[0],
            unidade: e.querySelector(".RUN").innerText.replace(/\s*UN:\s*/, ''),
            valor_unitario: e.querySelector(".RvlUnit").innerText.match(/\d+((,|\.)\d+)?/g)[0],
            valor_total: e.querySelector(".txtTit.noWrap").innerText.match(/\d+((,|\.)\d+)?/g)[0],
            nota_chave,
        }));
        let data_csv = lista_de_itens.map(item => itens_campos.map(campo => item.hasOwnProperty(campo) ? String(item[campo]).replace(sep, ',') : '').join(sep)).join('\n');
        if (args === 'copiar') {
            window.prompt("Use 'Ctrl+C, Enter' para copiar", data_csv);
        } else if (args === 'baixar') {
            data_csv = itens_campos.join(sep) + '\n' + data_csv;
            data_csv = "data:text/csv;charset=utf-8," + data_csv;
            var encodedUri = encodeURI(data_csv);
            window.open(encodedUri);
        }
    } else {
        alert("Página inválida, deve ser www4.fazenda.xx.gov.br");
    }
}


btn_copy_items.onclick = async() => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: coletar_itens,
        args: ['copiar']
    });
};

btn_donwload_items.onclick = async() => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: coletar_itens,
        args: ['baixar']
    });
};