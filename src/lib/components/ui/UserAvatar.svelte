<div class="user-avatar-element">
  <div class="bloom-container">
    <div class="button-container-main">
      <div class="button-inner">
        <div class="back"></div>
        <div class="front">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            ></path>
          </svg>
        </div>
      </div>
      <div class="button-glass">
        <div class="back"></div>
        <div class="front"></div>
      </div>
    </div>
    <div class="bloom bloom1"></div>
    <div class="bloom bloom2"></div>
  </div>
</div>

<style>
  .user-avatar-element {
    background: none;
    border: none;
  }

  .user-avatar-element .bloom-container {
    position: relative;
    transition: all 0.2s ease-in-out;
    border: none;
    background: none;
  }

  .user-avatar-element .bloom-container .button-container-main {
    width: 110px;
    aspect-ratio: 1;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    display: grid;
    place-content: center;
    border-right: 5px solid white;
    border-left: 5px solid rgba(128, 128, 128, 0.147);
    transform: rotate(-45deg);
    transition: all 0.5s ease-in-out;
  }

  .user-avatar-element .bloom-container .button-container-main .button-inner {
    height: 60px;
    aspect-ratio: 1;
    border-radius: 50%;
    position: relative;
    box-shadow: rgba(100, 100, 111, 0.5) -10px 5px 10px 0px;
    transition: all 0.5s ease-in-out;
  }

  .user-avatar-element .bloom-container .button-container-main .button-inner .back {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(
      60deg,
      rgb(1, 85, 103) 0%,
      rgb(147, 245, 255) 100%
    );
  }

  .user-avatar-element .bloom-container .button-container-main .button-inner .front {
    position: absolute;
    inset: 5px;
    border-radius: 50%;
    background: linear-gradient(
      60deg,
      rgb(0, 103, 140) 0%,
      rgb(58, 209, 233) 100%
    );
    display: grid;
    place-content: center;
  }

  .user-avatar-element .bloom-container .button-container-main .button-inner .front .svg {
    fill: #ffffff;
    opacity: 0.5;
    width: 30px;
    aspect-ratio: 1;
    transform: rotate(45deg);
    transition: all 0.2s ease-in;
  }

  .user-avatar-element .bloom-container .button-container-main .button-glass {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.888) 100%
    );
    transform: translate(0%, -50%) rotate(0deg);
    transform-origin: bottom center;
    transition: all 0.5s ease-in-out;
  }

  .user-avatar-element .bloom-container .bloom {
    height: 1px;
    width: 1px;
    position: absolute;
    background: white;
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
  }

  .user-avatar-element .bloom-container .bloom1 {
    top: 10px;
    right: 20px;
    box-shadow:
      rgb(255, 255, 255) 0px 0px 10px 10px,
      rgb(255, 255, 255) 0px 0px 20px 20px;
  }

  .user-avatar-element .bloom-container .bloom2 {
    bottom: 10px;
    left: 20px;
    box-shadow:
      rgba(255, 255, 255, 0.5) 0px 0px 10px 10px,
      rgba(255, 255, 255, 0.5) 0px 0px 30px 20px;
  }

  .user-avatar-element .bloom-container:hover {
    transform: scale(1.1);
  }

  .user-avatar-element .bloom-container:hover .button-container-main .button-glass {
    transform: translate(0%, -40%);
  }

  .user-avatar-element .bloom-container:hover .bloom {
    opacity: 1;
  }

  .user-avatar-element
    .bloom-container:hover
    .button-container-main
    .button-inner
    .front
    .svg {
    opacity: 1;
    filter: drop-shadow(0 0 10px white);
  }
</style>
