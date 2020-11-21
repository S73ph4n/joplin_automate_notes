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
					var body = note.body.split('```');
					var noteCode = "";
					for (let i in body){
						var codeBlock = body[i].split('\n');
						if (codeBlock[0].includes('javascript')){
							// leave out the first line and join the rest, then add to the code
							noteCode += codeBlock.slice(1).join('\n');
							// TODO : put code results after the block ?
						}
					}
					console.info('Running note code...');
					//console.info(noteCode);
					var noteFunction = new Function (noteCode);
					// TODO : show the results in a panel (at the top of the note ? on the side ?)

					var noteCodeResult = await noteFunction();
					//await joplin.views.panels.setHtml(panel, noteCodeResult);
			}
				} else {
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
