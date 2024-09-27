var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    mode: "text/x-c++src",
});
document.getElementById('lang').addEventListener('change', function () {
    var lang = this.value;
    var mode;
    switch (lang) {
        case 'C':
            mode = "text/x-csrc";
            break;
        case 'C++':
            mode = "text/x-c++src";
            break;
        case 'Java':
            mode = "text/x-java";
            break;
        case 'Python':
            mode = "text/x-python";
            break;
    }
    editor.setOption("mode", mode);
});

document.getElementById('myform').onsubmit = function (event) {
    event.preventDefault();

    var code = editor.getValue();
    var input = document.getElementById('inputText').value;
    var lang = document.getElementById('lang').value;
    var inputRadio = document.querySelector('input[name="inputRadio"]:checked').value;

    const requiresInput = /scanf|cin|getline|gets|fgets|input|sys\.stdin\.read|fileinput|argparse|next|nextLine|nextInt|nextDouble|nextFloat|nextLong|nextShort|nextBoolean|nextByte|readLine/g.test(code);
    //|System\.in
    if (requiresInput && inputRadio === 'false') {
        alert("This code requires input. Please select 'Compile with Input' and provide input.");
        return;
    }
    var formData = {
        code: code,
        input: input,
        lang: lang,
        inputRadio: inputRadio
    };

    fetch('/compilecode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('outputText').innerText = data;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('outputText').innerText = "An error occurred: " + error;
        });
};