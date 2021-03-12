const axios = require('axios');
const fs = require('fs');

const update_champs_json = (language="en_GB") => {
    axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
        .then(response => {
            const current_ver = response.data[0];
            return current_ver
        })
        .then(current_ver => {
            axios.get(`http://ddragon.leagueoflegends.com/cdn/${current_ver}/data/${language}/champion.json`)
                .then(response => {
                    const champ_data = response.data["data"];
                    const to_JSON = JSON.stringify(champ_data);

                    fs.writeFile('./data/champs.json', to_JSON, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log(`champs.json (${language}) updated for ${current_ver}`);
                    });
                })
        })
}

update_champs_json()

const update_items_json = (language="en_GB") => {
    axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
        .then(response => {
            const current_ver = response.data[0];
            return current_ver
        })
        .then(current_ver => {
            axios.get(`http://ddragon.leagueoflegends.com/cdn/${current_ver}/data/${language}/item.json`)
                .then(response => {
                    const item_data = response.data["data"];
                    const to_JSON = JSON.stringify(item_data);

                    fs.writeFile('./data/items.json', to_JSON, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log(`items.json (${language}) updated for ${current_ver}`);
                    });
                })
        })
}

update_items_json();

const update_runes_json = (language="en_GB") => {
    axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
        .then(response => {
            const current_ver = response.data[0];
            return current_ver
        })
        .then(current_ver => {
            axios.get(`http://ddragon.leagueoflegends.com/cdn/${current_ver}/data/${language}/runesReforged.json`)
                .then(response => {
                    const rune_data = response.data;
                    const to_JSON = JSON.stringify(rune_data);

                    fs.writeFile('./data/runes.json', to_JSON, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log(`runes.json (${language}) updated for ${current_ver}`);
                    });
                })
        })
}

update_runes_json();

