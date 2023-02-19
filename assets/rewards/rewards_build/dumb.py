import tkinter as tk
import random

def yes_clicked():
    print("You clicked Yes!")
    # Reload the window
    root.destroy()
    import assets.rewards.rewards_build.dumb as dumb
    dumb.root.mainloop()

def no_clicked():
    print("You clicked No!")
    # Change the position of the button randomly
    randX = random.randint(0, 400)
    randY = random.randint(0, 400)
    no_button.place(x=randX, y=randY)

root = tk.Tk()
root.geometry("400x400")
prompt_label = tk.Label(root, text="Are you dumb ?")
prompt_label.pack()

yes_button = tk.Button(root, text="Yes", command=yes_clicked)
yes_button.pack(side=tk.LEFT, padx=10)

no_button = tk.Button(root, text="No", command=no_clicked)
no_button.pack(side=tk.RIGHT, padx=10)

root.mainloop()
