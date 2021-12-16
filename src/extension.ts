'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.gapline', () => {
        // Creo una instacia del editor
        var editor = vscode.window.activeTextEditor;

        // Si el editor no esta activo, no se hace nada
        if (!editor) { return; }

        // Tomo el texto seleccionado y lo agrego a la variable selection
        var selection = editor.selection;

        // Extraigo el texto seleccionado
        var text = editor.document.getText(selection);

        // Al ejecutar el comando, muestro un imput que me indica cada cuantas lineas quiero colocar una linea en blanco
        vscode.window.showInputBox({ prompt: 'Lineas ?' }).then(value => {
            // Obtengo cada cuantas lineas debo poner el salto
            let numberOfLines = +value;

            // Creo el array donde se almacenara el texto con los saltos de linea.
            var textInChunks: Array<string> = [];

            //El texto seleccionado lo divido por saltos de linea, y lo itero a
            //traves de un foreach, luego lleno el array creado previamente con
            //cada una de las lineas de texto, pero adicionalmente cada vez que
            //la linea es modulo del valor que ingrese, se agrega un elemento al
            //array en blanco
            text.split('\n').forEach((currentLine: string, lineIndex) => {
                textInChunks.push(currentLine);
                if ((lineIndex+1) % numberOfLines === 0) textInChunks.push('');
            });
            
            //Obtengo en texto los valores del array, agregando un salto de linea
            //entre cada valor del array
            text = textInChunks.join('\n');
            
            //Reemplazo el texto nuevo con los saltos de linea, por el anterior
            editor.edit((editBuilder) => {
                var range = new vscode.Range(
                    selection.start.line, 0, 
                    selection.end.line,
                    editor.document.lineAt(selection.end.line).text.length
                );
                editBuilder.replace(range, text);
            });
        });
    });
    context.subscriptions.push(disposable);
}

export function deactivate() { }