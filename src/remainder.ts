class Reminder {
    constructor(
        public id: string,
        public text: string,
        public date: string,
        public completed: boolean = false
    ) {}
}

class ReminderDatabase {
    private reminders: Map<string, Reminder> = new Map();

    private generateUniqueId(): string {
        let id: string;
        do {
            id = Math.floor(100 + Math.random() * 9000).toString();
        } while (this.reminders.has(id));
        return id;
    }

    createReminder(text: string, date: string) {
        const id = this.generateUniqueId();
        this.reminders.set(id, new Reminder(id, text, date));
    }

    exists(id: string): boolean {
        return this.reminders.has(id);
    }

    getAllReminders(): Reminder[] {
        return Array.from(this.reminders.values());
    }

    getReminder(id: string): Reminder | null {
        return this.reminders.get(id) || null;
    }

    removeReminder(id: string): boolean {
        return this.reminders.delete(id);
    }

    updateReminder(id: string, text: string, date: string): boolean {
        if (this.reminders.has(id)) {
            const reminder = this.reminders.get(id)!;
            reminder.text = text;
            reminder.date = date;
            return true;
        }
        return false;
    }

    markReminderAsCompleted(id: string): boolean {
        if (this.reminders.has(id)) {
            this.reminders.get(id)!.completed = true;
            return true;
        }
        return false;
    }

    unmarkReminderAsCompleted(id: string): boolean {
        if (this.reminders.has(id)) {
            this.reminders.get(id)!.completed = false;
            return true;
        }
        return false;
    }

    getAllRemindersMarkedAsCompleted(): Reminder[] {
        return Array.from(this.reminders.values()).filter(reminder => reminder.completed);
    }

    getAllRemindersNotMarkedAsCompleted(): Reminder[] {
        return Array.from(this.reminders.values()).filter(reminder => !reminder.completed);
    }

    getAllRemindersDueByToday(): Reminder[] {
        const today = new Date().toISOString().split('T')[0];
        return Array.from(this.reminders.values()).filter(reminder => reminder.date === today);
    }
}

const db = new ReminderDatabase();

const getInput = (question: string): Promise<string> => {
    return new Promise((resolve) => {
        process.stdout.write(question);
        process.stdin.once("data", (data) => resolve(data.toString().trim()));
    });
};

const main = async () => {
    while (true) {
        console.log("1. Create Reminder");
        console.log("2. View All Reminders");
        console.log("3. Get Reminder");
        console.log("4. Remove Reminder");
        console.log("5. Update Reminder");
        console.log("6. Mark Reminder as Completed");
        console.log("7. Unmark Reminder as Completed");
        console.log("8. View Completed Reminders");
        console.log("9. View Pending Reminders");
        console.log("10. View Reminders Due Today");
        console.log("11. Exit");

        const choice = await getInput("Choose an option: ");

        switch (choice) {
            case "1": {
                const text = await getInput("Enter Reminder Text: ");
                const date = await getInput("Enter Date (YYYY-MM-DD): ");
                db.createReminder(text, date);
                console.log("Reminder created successfully!");
                break;
            }
            case "2": {
                console.log("All Reminders:", db.getAllReminders());
                break;
            }
            case "3": {
                const id = await getInput("Enter Reminder ID: ");
                console.log("Reminder:", db.getReminder(id));
                break;
            }
            case "4": {
                const id = await getInput("Enter Reminder ID to remove: ");
                console.log(db.removeReminder(id) ? "Reminder removed." : "Reminder not found.");
                break;
            }
            case "5": {
                const id = await getInput("Enter Reminder ID to update: ");
                const text = await getInput("Enter new Reminder Text: ");
                const date = await getInput("Enter new Date (YYYY-MM-DD): ");
                console.log(db.updateReminder(id, text, date) ? "Reminder updated." : "Reminder not found.");
                break;
            }
            case "6": {
                const id = await getInput("Enter Reminder ID to mark as completed: ");
                console.log(db.markReminderAsCompleted(id) ? "Reminder marked as completed." : "Reminder not found.");
                break;
            }
            case "7": {
                const id = await getInput("Enter Reminder ID to unmark as completed: ");
                console.log(db.unmarkReminderAsCompleted(id) ? "Reminder unmarked as completed." : "Reminder not found.");
                break;
            }
            case "8": {
                console.log("Completed Reminders:", db.getAllRemindersMarkedAsCompleted());
                break;
            }
            case "9": {
                console.log("Pending Reminders:", db.getAllRemindersNotMarkedAsCompleted());
                break;
            }
            case "10": {
                console.log("Reminders Due Today:", db.getAllRemindersDueByToday());
                break;
            }
            case "11":
                console.log("Exiting...");
                process.exit(0);
            default:
                console.log("Invalid option. Try again.");
        }
    }
};

main();
