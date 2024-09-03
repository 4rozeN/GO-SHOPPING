<template>
  <div class="avatar-upload">
    <vue-cropper
      v-if="showCropper"
      ref="cropper"
      :img="imageSrc"
      :output-size="{ width: 200, height: 200 }"
      :output-type="'jpeg'"
      :can-move-box="true"
      :auto-crop="true"
      :fixed-box="true"
      :fixed="true"
      :center-box="true"
    ></vue-cropper>

    <div v-else>
      <img :src="avatarUrl" alt="Avatar" v-if="avatarUrl" class="avatar-preview" />
      <input type="file" @change="onAvatarChange" />
    </div>

    <div v-if="showCropper" class="cropper-controls">
      <button @click="cropImage">裁剪并上传</button>
      <button @click="cancelCrop">取消</button>
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropper'
import { uploadImage } from '@/api/user'

export default {
  components: {
    VueCropper
  },
  data () {
    return {
      avatarUrl: '', // 存储裁剪后的头像URL
      imageSrc: '', // 存储用户选择的图片的URL
      showCropper: false // 控制是否显示裁剪器
    }
  },
  methods: {
    onAvatarChange (event) {
      const file = event.target.files[0]
      if (file) {
        this.imageSrc = URL.createObjectURL(file)
        this.showCropper = true
      }
    },
    async cropImage () {
      // 获取裁剪后的图片数据
      this.$refs.cropper.getCropBlob(async (blob) => {
        // 上传裁剪后的图片
        try {
          const formData = new FormData()
          formData.append('file', blob)
          const response = await uploadImage(blob)
          if (response.status === 200) {
            this.avatarUrl = response.data.fileInfo.preview_url
            this.showCropper = false
          } else {
            this.$toast.fail('上传失败，请重试')
          }
        } catch (error) {
          this.$toast.fail('上传失败，请重试')
          console.error(error)
        }
      })
    },
    cancelCrop () {
      this.showCropper = false
      this.imageSrc = ''
    }
  }
}

</script>

<style>
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-preview {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.cropper-controls {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.cropper-controls button {
  padding: 5px 10px;
  background-color: #FF3E47;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cropper-controls button:hover {
  background-color: #E0363D;
}
</style>
