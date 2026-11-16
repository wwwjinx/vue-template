<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { DeptInfo } from '@/types/system'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addDept, delDept, getDept, listDept, updateDept } from '@/api/system/dept'
import { handleTree } from '@/utils/tree'

const { sys_normal_disable } = useDict('sys_normal_disable')

const loading = ref(false)
const depts = ref<DeptInfo[]>([])
const query = reactive({ deptName: '', status: '' })
const dialog = reactive({ visible: false, title: '', isEdit: false })
const formRef = ref<FormInstance>()
const form = reactive<Partial<DeptInfo>>({
  parentId: 0,
  deptName: '',
  orderNum: 0,
  leader: '',
  phone: '',
  email: '',
  status: '0',
})
const rules: FormRules = {
  deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  orderNum: [{ required: true, message: '请输入排序', trigger: 'blur' }],
}

const deptOptions = computed(() => [
  { deptId: 0, deptName: '根部门', children: depts.value },
])

async function loadList() {
  loading.value = true
  try {
    const rows = (await listDept({ ...query })) ?? []
    depts.value = handleTree(rows as unknown as Record<string, unknown>[], 'deptId', 'parentId') as unknown as DeptInfo[]
  }
  finally {
    loading.value = false
  }
}

function openCreate(row?: DeptInfo) {
  Object.assign(form, {
    deptId: undefined,
    parentId: row?.deptId ?? 0,
    deptName: '',
    orderNum: 0,
    leader: '',
    phone: '',
    email: '',
    status: '0',
  })
  dialog.title = '新增部门'
  dialog.isEdit = false
  dialog.visible = true
}

async function openEdit(row: DeptInfo) {
  const detail = await getDept(row.deptId!)
  Object.assign(form, detail)
  dialog.title = '修改部门'
  dialog.isEdit = true
  dialog.visible = true
}

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid)
    return
  if (dialog.isEdit)
    await updateDept(form)
  else
    await addDept(form)
  ElMessage.success(dialog.isEdit ? '修改成功' : '新增成功')
  dialog.visible = false
  loadList()
}

async function onDelete(row: DeptInfo) {
  await ElMessageBox.confirm(`确认删除部门「${row.deptName}」吗？`, '提示', { type: 'warning' })
  await delDept(row.deptId!)
  ElMessage.success('删除成功')
  loadList()
}

onMounted(loadList)
</script>

<template>
  <div>
    <ElForm :inline="true" :model="query">
      <ElFormItem label="部门名称">
        <ElInput v-model="query.deptName" clearable />
      </ElFormItem>
      <ElFormItem label="状态">
        <ElSelect v-model="query.status" clearable style="width: 140px">
          <ElOption v-for="item in sys_normal_disable.list" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" @click="loadList">
          搜索
        </ElButton>
        <ElButton v-hasPermi="'system:dept:add'" type="primary" @click="openCreate()">
          新增
        </ElButton>
      </ElFormItem>
    </ElForm>
    <ElTable v-loading="loading" :data="depts" row-key="deptId" default-expand-all :tree-props="{ children: 'children' }">
      <ElTableColumn prop="deptName" label="部门名称" min-width="180" />
      <ElTableColumn prop="orderNum" label="排序" width="80" />
      <ElTableColumn prop="leader" label="负责人" />
      <ElTableColumn prop="phone" label="电话" />
      <ElTableColumn prop="email" label="邮箱" />
      <ElTableColumn label="状态" width="80">
        <template #default="{ row }">
          {{ sys_normal_disable.valueToLabel[row.status || ''] || row.status }}
        </template>
      </ElTableColumn>
      <ElTableColumn prop="createTime" label="创建时间" min-width="160" />
      <ElTableColumn label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <ElButton v-hasPermi="'system:dept:add'" link type="primary" @click="openCreate(row)">
            新增
          </ElButton>
          <ElButton v-hasPermi="'system:dept:edit'" link type="primary" @click="openEdit(row)">
            修改
          </ElButton>
          <ElButton v-hasPermi="'system:dept:remove'" link type="danger" @click="onDelete(row)">
            删除
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <ElDialog v-model="dialog.visible" :title="dialog.title" width="520px" destroy-on-close>
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="90px">
        <ElFormItem label="上级部门">
          <ElTreeSelect
            v-model="form.parentId"
            :data="deptOptions"
            node-key="deptId"
            :props="{ label: 'deptName', children: 'children' }"
            check-strictly
            style="width: 100%"
          />
        </ElFormItem>
        <ElFormItem label="部门名称" prop="deptName">
          <ElInput v-model="form.deptName" />
        </ElFormItem>
        <ElFormItem label="显示排序" prop="orderNum">
          <ElInputNumber v-model="form.orderNum" :min="0" />
        </ElFormItem>
        <ElFormItem label="负责人">
          <ElInput v-model="form.leader" />
        </ElFormItem>
        <ElFormItem label="联系电话">
          <ElInput v-model="form.phone" />
        </ElFormItem>
        <ElFormItem label="邮箱">
          <ElInput v-model="form.email" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElRadioGroup v-model="form.status">
            <ElRadio v-for="item in sys_normal_disable.list" :key="item.value" :value="item.value">
              {{ item.label }}
            </ElRadio>
          </ElRadioGroup>
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
