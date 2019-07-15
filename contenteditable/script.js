
var $editor;

$(document).ready(function() {
    $editor = $('#editor').text('Hello world!');
});

function createInsertCommand($elem, textToInsert, position) {

    var context = {
        $elem: $elem,
        text: textToInsert,
        pos: position
    };

    return {
        exec: function() {
            var text = this.$elem.text();
            var newText = text.substring(0, this.pos) + this.text + text.substring(this.pos);
            this.$elem.text(newText);
        }.bind(context),

        undo: function() {
            var text = this.$elem.text();
            var insertedLength = this.text.length;
            var newText = text.substring(0, this.pos) + text.substring(this.pos + insertedLength);
            this.$elem.text(newText);
        }.bind(context)
    }
};

function Model() {

    var commandStack = [];

    return {
        execCommand: function(command) {
            commandStack.push(command);
            command.exec();
        },

        undo: function() {
            if (commandStack.length !== 0) {
                commandStack.pop().undo();
            }
        }
    };
};

const model = Model();

function insertText(text, position) {
    var insertCommand = createInsertCommand($editor, text, position);
    model.execCommand(insertCommand);
};

function undo() {
    model.undo();
}