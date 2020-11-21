import joplin from 'api';
import { ToolbarButtonLocation } from 'api/types';
joplin.plugins.register({
	onStart: async function() {
		// Create the panel object
		//const panel = await joplin.views.panels.create();
		//await joplin.views.panels.setHtml(panel, 'Loading...');

		async function runNoteJs() {
			// Get the current note from the workspace.
			const note = await joplin.workspace.selectedNote();

				// Keep in mind that it can be `null` if nothing is currently selected!
			if (note) {
				// Only run if title matches this :
				if (note.title.includes('[Run]')){
					console.info('Note content has changed! New note is:', note);
					var body = note.body.split('\n');
					var i = 0;
					while (i < body.length){
						if (body[i].startsWith('```') && body[i].includes('javascript')){ //found a block
							i++;
							var code = "";
							while (i < body.length){
								if (body[i].startsWith('```')){//end of the block
									break;
								}
								code += body[i] + '\n';
								i++;
							}
							// run the block
							console.info('Running code block...');
							console.info(code);
							var noteFunction = new Function ('note', code);
							var codeResult = await noteFunction(note);
							//var codeResult = eval(code);
							i++;
							var iStart = i;
							//if result exists :
							if (i < body.length && body[i].startsWith('```results')){ //go to the bottom of it
								i++;
								while (i < body.length){
									if (body[i].startsWith('```')){
										i++; 
										break;
									}
									i++
								}
							}
							var iEnd = i;
							var newBody = body.slice(0, iStart).concat(['```results'],[codeResult],['```'],body.slice(iEnd)).join('\n');
							console.info(newBody);
							await joplin.data.put(['notes', note.id], null, { body: newBody});
						}
						else{
							i++;
						}
					}
				}
			}
			else {
				console.info('No note is selected');
			}
		}

		// This event will be triggered when the user selects a different note
		await joplin.workspace.onNoteSelectionChange(() => {
			runNoteJs();
		});

		// This event will be triggered when the content of the note changes
		// as you also want to update the TOC in this case.
		await joplin.workspace.onNoteContentChange(() => {
			runNoteJs();
		});

		// Also update the TOC when the plugin starts
		runNoteJs();
	},
});
