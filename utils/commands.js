const parseCommand = (msg) => {
    const input = {
        raw: msg.content,
    };

    input.arr = input.raw.split(' ');
    input.command = input.arr[0];

    if(input.command === '>op'){
        input.lane = {};
        input.lane.raw = input.arr[1].toLowerCase();
        input.lane.formatted = '**' + input.lane.raw.replace(/\b\w/g, l => l.toUpperCase()) + '**';

        return input
    }

    if(input.arr.length > 1){
        input.champ = {};
        input.champ.raw = input.arr[1].toLowerCase();
        input.champ.formatted = '**' + input.champ.raw.replace(/\b\w/g, l => l.toUpperCase()) + '**';
    }

    if(input.arr.length > 2){
        input.lane = {};
        input.lane.raw = input.arr[2].toLowerCase();
        input.lane.formatted = '**' + input.lane.raw.replace(/\b\w/g, l => l.toUpperCase()) + '**';
    }

    return input
}

module.exports = {parseCommand};