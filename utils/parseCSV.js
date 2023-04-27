module.exports = {
    parseCSV: (csvString, filename) => {
        try {
            const lines = csvString.split(/\r?\n/).filter(line => line.trim() !== '');
            lines.shift()
            const headers = ['text', 'number', 'hex'];
            const result = {
                file: filename,
                lines: []
            };

            if (lines.length) {
                for (let i = 0; i < lines.length; i++) {
                    const fields = lines[i].split(',');

                    const line = {
                        [headers[0]]: fields[1],
                        [headers[1]]: fields[2],
                        [headers[2]]: fields[3],
                    };

                    result.lines.push(line);
                }
            }

            return result;
        } catch (error) {
            console.log(error);
        }
    }
}