<template>
  <div className="authincation h-100 p-meddle">
    <div className="container h-100">
      <div className="row justify-content-center h-100 align-items-center ">
        <div className="col-md-5">
          <div className="form-input-content text-center error-page">
            <h1 className="error-text font-weight-bold">404</h1>
            <h4 className="text-warning">
              <i className="fa fa-exclamation-triangle sign-warning" />&nbsp;
              The page you were looking for is not found!
            </h4>
            <p>
              You may have mistyped the address or the page may have
              moved.
            </p>
            <div>
              <router-link className="btn btn-primary" to="/">
                Back to Home
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="less" scoped>
.p-meddle {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  width: 100%;
}
.error-text {
  font-family: 'Cairo', sans-serif;
}
.text-warning {
  font-family: 'Cairo', sans-serif;
  line-height: 1.2;
  color: #000;
}
.error-page .error-text {
  font-size: 150px;
  line-height: 1;
  // margin-bottom: 0;
}
@media only screen and (max-width: 575px) {
  .error-page .error-text {
    font-size: 80px;
  }
}
.error-page h4,
.error-page .h4 {
  font-size: 40px;
  margin-bottom: 5px;
}
@media only screen and (max-width: 575px) {

  .error-page h4,
  .error-page .h4 {
    font-size: 20px;
  }
}
.error-page p {
  font-size: 16px;
}
@media only screen and (max-width: 575px) {
  .error-page p {
    font-size: 14px;
  }
}
.btn {
  color: #fff;
  padding: 0.938rem 1.5rem;
  border-radius: 0.9rem;
  font-weight: 400;
  font-size: 1rem;
}

@media only screen and (max-width: 1400px) {
  .btn {
    padding: 0.625rem 1rem;
    font-size: 0.813rem;}
}
</style>