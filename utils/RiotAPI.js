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
                        console.log("JSON data is saved.");
                    });
                })
        })
}

update_champs_json()
