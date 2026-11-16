<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { DictDataInfo } from '@/types/system'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addDictData, delDictData, getDictData, listDictData, updateDictData } from '@/api/system/dict'

const { sys_normal_disable, sys_yes_no } = useDict('sys_normal_disable', 'sys_yes_no')
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const total = ref(0)
const rows = ref<DictDataInfo[]>([])
const selectedIds = ref<number[]>([])
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  dictType: String(route.query.dictType || ''),
  dictLabel: '',
  status: '',
})
const dialog = reactive({ visible: false, title: '', isEdit: false })
const formRef = ref<FormInstance>()
const form = reactive<Partial<DictDataInfo>>({
  dictType: query.dictType,
  dictLabel: '',
  dictValue: '',
  dictSort: 0,
  listClass: 'default',
  isDefault: 'N',
  status: '0',
  remark: '',
})
const rules: FormRules = {
  dictLabel: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
  dictValue: [{ required: true, message: '请输入字典键值', trigger: 'blur' }],
}

async function loadList() {
  loading.value = true
  try {
    const res = await listDictData({ ...query })
    rows.value = res?.rows ?? []
    total.value = res?.total ?? 0
  }
  finally {
    loading.value = false
  }
}

function openCreate() {
  Object.assign(form, {
    dictCode: undefined,
    dictType: query.dictType,
    dictLabel: '',
    dictValue: '',
    dictSort: 0,
    listClass: 'default',
    isDefault: 'N',
    status: '0',
    remark: '',
  })
  dialog.title = '新增字典数据'
  dialog.isEdit = false
  dialog.visible = true
}

async function openEdit(row: DictDataInfo) {
  Object.assign(form, await getDictData(row.dictCode))
  dialog.title = '修改字典数据'
  dialog.isEdit = true
  dialog.visible = true
}

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid)
    return
  if (dialog.isEdit)
    await updateDictData(form)
  else
    await addDictData(form)
  ElMessage.success(dialog.isEdit ? '修改成功' : '新增成功')
  dialog.visible = false
  loadList()
}

async function onDelete(row?: DictDataInfo) {
  const ids = row ? String(row.dictCode) : selectedIds.value.join(',')
  if (!ids)
    return
  await ElMessageBox.confirm('确认删除选中的字典数据吗？', '提示', { type: 'warning' })
  await delDictData(ids)
  ElMessage.success('删除成功')
  loadList()
}

onMounted(loadList)
</script>

<template>
  <div>
    <ElForm :inline="true" :model="query">
      <ElFormItem label="字典类型">
        <ElInput v-model="query.dictType" disabled />
      </ElFormItem>
      <ElFormItem label="字典标签">
        <ElInput v-model="query.dictLabel" clearable />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" @click="query.pageNum = 1; loadList()">
          搜索
        </ElButton>
        <ElButton v-hasPermi="'system:dict:add'" type="primary" @click="openCreate">
          新增
        </ElButton>
        <ElButton v-hasPermi="'system:dict:remove'" type="danger" :disabled="!selectedIds.length" @click="onDelete()">
          删除
        </ElButton>
        <ElButton @click="router.push('/system/dict')">
          返回
        </ElButton>
      </ElFormItem>
    </ElForm>
    <ElTable v-loading="loading" :data="rows" @selection-change="(list: DictDataInfo[]) => selectedIds = list.map(i => i.dictCode)">
      <ElTableColumn type="selection" width="50" />
      <ElTableColumn prop="dictCode" label="编号" width="80" />
      <ElTableColumn prop="dictLabel" label="字典标签" />
      <ElTableColumn prop="dictValue" label="字典键值" />
      <ElTableColumn prop="dictSort" label="排序" width="80" />
      <ElTableColumn label="状态" width="80">
        <template #default="{ row }">
          {{ sys_normal_disable.valueToLabel[row.status || ''] || row.status }}
        </template>
      </ElTableColumn>
      <ElTableColumn prop="remark" label="备注" />
      <ElTableColumn label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <ElButton v-hasPermi="'system:dict:edit'" link type="primary" @click="openEdit(row)">
            修改
          </ElButton>
          <ElButton v-hasPermi="'system:dict:remove'" link type="danger" @click="onDelete(row)">
            删除
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
    <div class="pager">
      <ElPagination
        v-model:current-page="query.pageNum"
        v-model:page-size="query.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @current-change="loadList" @size-change="loadList"
      />
    </div>
    <ElDialog v-model="dialog.visible" :title="dialog.title" width="520px" destroy-on-close>
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="90px">
        <ElFormItem label="字典类型">
          <ElInput v-model="form.dictType" disabled />
        </ElFormItem>
        <ElFormItem label="字典标签" prop="dictLabel">
          <ElInput v-model="form.dictLabel" />
        </ElFormItem>
        <ElFormItem label="字典键值" prop="dictValue">
          <ElInput v-model="form.dictValue" />
        </ElFormItem>
        <ElFormItem label="排序">
          <ElInputNumber v-model="form.dictSort" :min="0" />
        </ElFormItem>
        <ElFormItem label="是否默认">
          <ElRadioGroup v-model="form.isDefault">
            <ElRadio v-for="item in sys_yes_no.list" :key="item.value" :value="item.value">
              {{ item.label }}
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="状态">
          <ElRadioGroup v-model="form.status">
            <ElRadio v-for="item in sys_normal_disable.list" :key="item.value" :value="item.value">
              {{ item.label }}
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="备注">
          <ElInput v-model="form.remark" type="textarea" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialog.visible = false">
          取消
        </ElButton>
        <ElButton type="primary" @click="submit">
          确定
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
