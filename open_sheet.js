const btn_open_sheet = document.getElementById('open-sheet');

btn_open_sheet.onclick = async() => {
    chrome.tabs.create({ url: 'https://docs.google.com/spreadsheets/d/1kRaNcRHOdwbTxideItZBZsGpiwdOAY4L8xFJFfv3Q-M' })
        // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // chrome.scripting.executeScript({
    // target: { tabId: tab.id },
    // function: baixar_itens_comprados,
    // });
};