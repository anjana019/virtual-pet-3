//Create variables here
var dog, happyDog, database, foodS, foodStock, getFoodStock, updateFoodStock, deductFood, foodObj, lastFed, gameState, readState;
var bedroom, washroom, garden, currentTime;
function preload() {

  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed Room.png");
  washroom = loadImage("images/Wash Room.png");
  garden = loadImage("images/Garden.png");
}

function setup() {
  createCanvas(1000, 400);
  database = firebase.database();

  foodObj = new Food();
  foodStock = database.ref('food');
  foodStock.on("value", readStock);
  dog = createSprite(250, 250, 15, 15);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  readState = database.ref('gameState');
  readState.on("value", function (data) {
    gameState = data.val();
  });

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);


}


function draw() {
  background(46, 139, 87);

  currentTime = hour();

  if (currentTime == (lastFed + 1)) {
    update("Playing");
    foodObj.garden();
  }
  else if (currentTime == (lastFed + 2)) {
    update("Sleeping");
    foodObj.bedroom();
  }
  else if (currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)) {
    update("Bathing");
    foodObj.washroom();
  }
  else {
    update("Hungry");
    foodObj.display();
  }

  if (gameState !== "Hungry") {
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else {
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
  }

  drawSprites();


}

function readStock(data) {
  food = data.val();
  foodObj.updateFoodStock(food);
}

//function to update food stock and last fed time
function feedDog() {
  dog.addImage(happyDogImg);


  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);


  database.ref('/').update({

    Food: foodObj.getFoodStock(),
    FeedTime: hour(),
    gameState: "Hungry"

  })
}

//function to add food in stock
function addFoods() {
  food++;
  database.ref('/').update({
    Food: food
  })
}
function update(state) {
  database.ref('/').update({
    gameState: state
  })
}
